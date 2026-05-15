const Cart = require("../../model/cart");
const Order = require("../../model/order");
const ApiResponse = require("../../utils/api_response");


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

            await Cart.findByIdAndDelete(cart._id);
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