const Cart = require("../../model/cart");
const Order = require("../../model/order");
const ApiResponse = require("../../utils/api_response");
const sendMail = require("../../config/sender");
const User = require('../../model/auth');

class order_controller {
    async create_order(req, res) {
        try {
            const user_id = req.user.id;
            const { shippingAddress } = req.body;

            if (!shippingAddress) {
                return ApiResponse.error(res, "Shipping address is required", 400);
            }

            const cart = await Cart.findOne({ user_id })

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
                user: user_id,
                items: orderItems,
                totalAmount,
                shippingAddress,
                status: 'pending',
                paymentStatus: 'unpaid'
            });

            const savedOrder = await newOrder.save();
            const user_email = await User.findById(user_id).select('email');

            await Cart.findByIdAndDelete(cart._id);

            const orderItemsHtml = orderItems.map(item => `
            <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;">${item.name}</td>
              <td align="center" style="padding:12px;border:1px solid #e5e7eb;">${item.quantity}</td>
              <td align="right" style="padding:12px;border:1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
            `).join('');

            await sendMail({
                email: user_email.email,
                subject: "Order placed successfully",
                html: `<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">

    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">
      
      <tr>
        <td align="center" style="background:#111827;padding:30px;">
          <h1 style="color:#ffffff;margin:0;">E-commerce</h1>
        </td>
      </tr>

      <tr>
        <td style="padding:40px 30px;">
          <h2 style="margin-top:0;color:#111827;">Order Confirmed 🎉</h2>

          <p style="color:#4b5563;font-size:16px;line-height:26px;">
            Hi ${req.user.name},
          </p>

          <p style="color:#4b5563;font-size:16px;line-height:26px;">
            Thank you for your order! We’ve received your purchase and are preparing it for shipping.
          </p>

          <!-- Order Info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:25px;border-collapse:collapse;">
            <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;"><strong>Order ID</strong></td>
              <td style="padding:12px;border:1px solid #e5e7eb;">#${savedOrder._id}</td>
            </tr>
         <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;"><strong>Order Date</strong></td>
              <td style="padding:12px;border:1px solid #e5e7eb;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding:12px;border:1px solid #e5e7eb;"><strong>Payment Method</strong></td>
              <td style="padding:12px;border:1px solid #e5e7eb;">Cash on Delivery</td>
            </tr>
          </table>
          <h3 style="margin-top:35px;color:#111827;">Order Summary</h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr style="background:#f9fafb;">
              <th align="left" style="padding:12px;border:1px solid #e5e7eb;">Product</th>
              <th align="center" style="padding:12px;border:1px solid #e5e7eb;">Qty</th>
              <th align="right" style="padding:12px;border:1px solid #e5e7eb;">Price</th>
            </tr>
            ${orderItemsHtml}
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td align="right">
                <p style="font-size:18px;color:#111827;">
                  <strong>Total: $${totalAmount.toFixed(2)}</strong>
                </p>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
            <tr>
              <td align="center">
                <a href="#"
                  style="background:#111827;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;display:inline-block;font-size:16px;">
                  Track Your Order
                </a>
              </td>
            </tr>
          </table>

          <p style="margin-top:40px;color:#6b7280;font-size:14px;line-height:24px;">
            If you have any questions, simply reply to this email or contact our support team.
          </p>

        </td>
      </tr>

      <tr>
        <td align="center" style="background:#f9fafb;padding:20px;color:#6b7280;font-size:13px;">
          © 2026 YourStore. All rights reserved.
        </td>
      </tr>

    </table>

  </td>
</tr>

  </table>

</body>
</html>
`,
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
            const orders = await Order.find()
                .populate('user', 'name email')
                .sort({ createdAt: -1 });

            if (!orders || orders.length === 0) {
                return ApiResponse.error(res, "No orders found", 404);
            }

            const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            return ApiResponse.success(res, "Orders retrieved successfully", {
                count: orders.length,
                totalSales,
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
            const orders = await Order.find({ user: userId })
                .populate('items.product', 'name image price')
                .sort({ createdAt: -1 });

            if (!orders || orders.length === 0) {
                return ApiResponse.error(res, "No orders found for this user", 404);
            }
            return ApiResponse.success(res, "User orders retrieved successfully", {
                count: orders.length,
                data: orders
            });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}

module.exports = new order_controller;