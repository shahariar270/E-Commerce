const Cart = require("../../model/cart");
const Order = require("../../model/order");


class order_controller {
    async create_order(req, res) {
        try {
            const user_id = req.user.id;
            const { shippingAddress } = req.body;

            if (!shippingAddress) {
                return res.status(400).json({ message: "Shipping address is required" });
            }

            const cart = await Cart.findOne({ user_id })

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: "Your cart is empty" });
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
            return res.status(201).json({
                message: "Order placed successfully",
                orderId: savedOrder._id,
                total: savedOrder.totalAmount
            });

        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }

    async admin_all_order(req, res) {
        try {
            const orders = await Order.find()
                .populate('user', 'name email')
                .sort({ createdAt: -1 });

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "No orders found" });
            }

            const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            return res.status(200).json({
                success: true,
                count: orders.length,
                totalSales,
                data: orders
            });

        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
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
                return res.status(404).json({ message: "Order not found!" });
            }

            res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update_order_status(req, res) {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found!" });
            }
            order.status = status;
            await order.save();
            res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                data: order
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }

    async delete_order(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order
                .findByIdAndDelete(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found!" });
            }
            res.status(200).json({
                success: true,
                message: "Order deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async single_user_orders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.find({ user: userId })
                .populate('items.product', 'name image price')
                .sort({ createdAt: -1 });

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "No orders found for this user" });
            }
            res.status(200).json({
                success: true,
                count: orders.length,
                orders
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new order_controller;