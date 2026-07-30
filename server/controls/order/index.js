const Cart = require("../../model/cart");
const Order = require("../../model/order");
const Coupon = require("../../model/coupon");
const User = require("../../model/auth");
const Subscriber = require("../../model/subscriber");
const EmailVerification = require("../../model/emailVerification");
const Settings = require("../../model/settings");
const Product = require("../../model/product");
const ApiResponse = require("../../utils/api_response");
const sendMail = require("../../config/sender");
const socketManager = require('../../socket');
const { calculateTotals, refreshCartCoupon } = require("../cart/helper");

const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

const escapeHtml = (str) =>
    String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

// Returns items reserved at checkout back to product stock. Callers must
// only invoke this once per order (guarded by order.stock_restored) since
// there's no reverse link from Product back to the reservation to dedupe.
const restockOrderItems = async (items) => {
    for (const item of items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
};

class order_controller {
    async create_order(req, res) {
        try {
            const { id: user_id, guest_id } = req.user;
            const { shippingAddress, email: submittedEmail, save_address, subscribe } = req.body;

            if (!shippingAddress) {
                return ApiResponse.error(res, "Shipping address is required", 400);
            }
            if (!BD_PHONE_REGEX.test(shippingAddress.phone || '')) {
                return ApiResponse.error(res, "Enter a valid Bangladeshi phone number (e.g. 01712345678)", 400);
            }

            // Authenticated orders always use the account's own email — never
            // trust a client-supplied value here, or any logged-in user could
            // relay an unverified order-confirmation email (and forced
            // newsletter subscription) to an arbitrary address via a direct
            // API call, bypassing the guest email-verification flow below.
            let email;
            if (user_id) {
                const account = await User.findById(user_id).select('email');
                if (!account) {
                    return ApiResponse.error(res, "User not found", 404);
                }
                email = account.email;
            } else {
                email = submittedEmail;
                if (!email) {
                    return ApiResponse.error(res, "Email is required", 400);
                }
            }

            if (user_id && save_address) {
                await User.findByIdAndUpdate(user_id, {
                    saved_address: {
                        name: shippingAddress.name,
                        phone: shippingAddress.phone,
                        address: shippingAddress.address,
                        city: shippingAddress.city,
                        postalCode: shippingAddress.postalCode,
                    },
                });
            }

            if (!user_id) {
                const settings = await Settings.findOne();
                const requireGuestEmailVerification = settings ? settings.require_guest_email_verification : true;

                if (requireGuestEmailVerification) {
                    const verification = await EmailVerification.findOne({
                        guest_id,
                        email: email.trim().toLowerCase(),
                        verified: true,
                    });
                    if (!verification) {
                        return ApiResponse.error(res, "Please verify your email before placing an order", 400);
                    }
                }
            }

            const cartFilter = user_id ? { user_id } : { guest_id };
            const cart = await Cart.findOne(cartFilter)

            if (!cart || cart.items.length === 0) {
                return ApiResponse.error(res, "Your cart is empty", 400);
            }
            const orderItems = cart.items.map(item => ({
                product: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            // Re-verify and reserve stock now, atomically per item — the cart
            // may have been sitting for a while, and this is the only place
            // that guards against overselling when two orders race for the
            // same last unit. No DB transaction required: the conditional
            // $gte guard means a decrement either fully succeeds or is a
            // no-op, and anything already decremented in this order attempt
            // gets rolled back if a later item fails.
            const decremented = [];
            for (const item of orderItems) {
                // $ifNull normalizes a completely-missing stock field (e.g.
                // documents saved before stock existed on the schema) to 0
                // within the query itself, so it's never treated as
                // satisfying $gte by accident.
                const result = await Product.updateOne(
                    { _id: item.product, $expr: { $gte: [{ $ifNull: ["$stock", 0] }, item.quantity] } },
                    { $inc: { stock: -item.quantity } }
                );
                if (result.matchedCount === 0) {
                    for (const done of decremented) {
                        await Product.updateOne({ _id: done.product }, { $inc: { stock: done.quantity } });
                    }
                    const product = await Product.findById(item.product).select('product_name stock');
                    return ApiResponse.error(
                        res,
                        product
                            ? `Only ${Number(product.stock) || 0} left in stock for "${product.product_name}"`
                            : "One of the items in your cart is no longer available",
                        400
                    );
                }
                decremented.push(item);
            }

            // Re-sync the coupon against its live record so a discount an
            // admin edited (or expired/deactivated) after the customer
            // applied it doesn't get charged at its stale value.
            calculateTotals(cart);
            await refreshCartCoupon(cart);
            calculateTotals(cart);

            const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const couponCode = cart.coupon?.code || null;
            const discountAmount = couponCode ? (cart.coupon.discount_amount || 0) : 0;
            const totalAmount = Math.max(0, subtotal - discountAmount);

            const newOrder = new Order({
                user: user_id || undefined,
                guest_id: user_id ? undefined : guest_id,
                email,
                items: orderItems,
                subtotal,
                coupon: { code: couponCode, discount_amount: discountAmount },
                totalAmount,
                shippingAddress,
                status: 'pending',
                paymentStatus: 'unpaid'
            });

            const savedOrder = await newOrder.save();

            if (couponCode) {
                await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { used_count: 1 } });
            }

            if (subscribe) {
                const normalized_email = email.trim().toLowerCase();
                await Subscriber.findOneAndUpdate(
                    { email: normalized_email },
                    { email: normalized_email, source: 'checkout' },
                    { upsert: true, setDefaultsOnInsert: true }
                );
            }

            socketManager.emitToAdmins('new_order', {
                id: savedOrder._id,
                customerName: shippingAddress.name,
                itemCount: orderItems.length,
                totalAmount: savedOrder.totalAmount,
                createdAt: savedOrder.createdAt,
            });

            await Cart.findByIdAndDelete(cart._id);

            if (!user_id) {
                await EmailVerification.deleteOne({ guest_id, email: email.trim().toLowerCase() });
            }

            const orderItemsHtml = orderItems.map(item => `
            <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
              <td align="center" style="padding:12px;border:1px solid #e5e7eb;">${item.quantity}</td>
              <td align="right" style="padding:12px;border:1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
            `).join('');

            await sendMail({
                email,
                subject: "Order placed successfully",
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .content { padding: 20px !important; }
      .header { padding: 20px !important; }
      .order-info td { display: block; width: 100%; box-sizing: border-box; border: none !important; padding: 5px 0 !important; }
      .order-info tr { border-bottom: 1px solid #e5e7eb; display: block; padding: 10px 0; }
      .product-table th:nth-child(2), .product-table td:nth-child(2) { display: none; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:20px 0;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td class="header" align="center" style="background-color:#111827;padding:40px;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:1px;">E-commerce</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <h2 style="margin-top:0;color:#111827;font-size:24px;">Order Confirmed! 🎉</h2>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">Hi ${escapeHtml(shippingAddress.name)},</p>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">Your order has been placed successfully. We're getting it ready for you!</p>

              <!-- Order Details -->
              <table class="order-info" width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;border-collapse:collapse;">
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#6b7280;"><strong>Order ID</strong></td>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">#${savedOrder._id}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#6b7280;"><strong>Date</strong></td>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#6b7280;"><strong>Payment</strong></td>
                  <td style="padding:12px;border:1px solid #e5e7eb;color:#111827;">Cash on Delivery</td>
                </tr>
              </table>

              <h3 style="margin-top:40px;color:#111827;border-bottom:2px solid #f3f4f6;padding-bottom:10px;">Order Summary</h3>
              <table class="product-table" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background-color:#f9fafb;">
                    <th align="left" style="padding:12px;border-bottom:1px solid #e5e7eb;color:#374151;">Product</th>
                    <th align="center" style="padding:12px;border-bottom:1px solid #e5e7eb;color:#374151;">Qty</th>
                    <th align="right" style="padding:12px;border-bottom:1px solid #e5e7eb;color:#374151;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                ${couponCode ? `
                <tr>
                  <td align="right" style="padding:6px 0;">
                    <p style="font-size:14px;color:#6b7280;margin:0;">Subtotal: $${subtotal.toFixed(2)}</p>
                  </td>
                </tr>
                <tr>
                  <td align="right" style="padding:6px 0;">
                    <p style="font-size:14px;color:#16a34a;margin:0;">Discount (${couponCode}): -$${discountAmount.toFixed(2)}</p>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td align="right" style="padding:20px 0;border-top:2px solid #f3f4f6;">
                    <p style="font-size:20px;color:#111827;margin:0;">
                      <strong>Total Amount: $${totalAmount.toFixed(2)}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL || '#'}/orders" style="background-color:#111827;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;display:inline-block;font-size:16px;font-weight:bold;">View My Orders</a>
                  </td>
                </tr>
              </table>

              <p style="margin-top:40px;color:#9ca3af;font-size:14px;text-align:center;">
                Questions? Contact our support team at ${process.env.EMAIL_ADDRESS || 'support@example.com'}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9fafb;padding:30px;color:#6b7280;font-size:12px;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} E-commerce. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
            });

            return ApiResponse.success(res, "Order placed successfully", {
                orderId: savedOrder._id,
                total: savedOrder.totalAmount
            }, 201);

        } catch (error) {
            return ApiResponse.error(res, "Server Error", 500, error.message);
        }
    }

    async admin_all_order(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const orders = await Order.find()
                .populate('user', 'name email')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const total = await Order.countDocuments();
            const totalSalesResult = await Order.aggregate([
                { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
            ]);
            const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

            return ApiResponse.success(res, "Orders retrieved successfully", {
                count: orders.length,
                totalSales,
                total,
                data: orders
            });

        } catch (error) {
            return ApiResponse.error(res, "Server Error", 500, error.message);
        }
    }

    async get_single_order(req, res) {
        try {
            const orderId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            const order = await Order.findById(orderId)
                .populate('user', 'name email')
                .populate('items.product', 'name image category');


            if (!order) {
                return ApiResponse.error(res, "Order not found!", 404);
            }

            return ApiResponse.success(res, "Order retrieved successfully", order);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async update_order_status(req, res) {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            const order = await Order.findById(orderId);

            if (!order) {
                return ApiResponse.error(res, "Order not found!", 404);
            }

            if (status === 'cancelled' && order.status !== 'cancelled' && !order.stock_restored) {
                await restockOrderItems(order.items);
                order.stock_restored = true;
            }

            order.status = status;
            await order.save();
            return ApiResponse.success(res, "Order status updated successfully", order);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }

    }

    async delete_order(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return ApiResponse.error(res, "Order not found!", 404);
            }

            if (!order.stock_restored) {
                await restockOrderItems(order.items);
            }

            await Order.findByIdAndDelete(orderId);
            return ApiResponse.success(res, "Order deleted successfully");
        }
        catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async single_user_orders(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 10 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const orders = await Order.find({ user: userId })
                .populate('items.product', 'name image price')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const total = await Order.countDocuments({ user: userId });

            return ApiResponse.success(res, "User orders retrieved successfully", {
                count: orders.length,
                total,
                data: orders
            });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}

module.exports = new order_controller;