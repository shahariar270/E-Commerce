const Cart = require("../../model/cart");
const Order = require("../../model/order");
const ApiResponse = require("../../utils/api_response");
const sendMail = require("../../config/sender");

class order_controller {
    async create_order(req, res) {
        try {
            const { id: user_id, guest_id } = req.user;
            const { shippingAddress, email } = req.body;

            if (!shippingAddress) {
                return ApiResponse.error(res, "Shipping address is required", 400);
            }
            if (!email) {
                return ApiResponse.error(res, "Email is required", 400);
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

            const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            const newOrder = new Order({
                user: user_id || undefined,
                guest_id: user_id ? undefined : guest_id,
                email,
                items: orderItems,
                totalAmount,
                shippingAddress,
                status: 'pending',
                paymentStatus: 'unpaid'
            });

            const savedOrder = await newOrder.save();

            await Cart.findByIdAndDelete(cart._id);

            const orderItemsHtml = orderItems.map(item => `
            <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;">${item.name}</td>
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
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">Hi ${shippingAddress.name},</p>
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
            const order = await Order
                .findByIdAndDelete(orderId);

            if (!order) {
                return ApiResponse.error(res, "Order not found!", 404);
            }
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