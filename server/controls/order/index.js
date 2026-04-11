const Cart = require("../../model/cart");


class order_controller {
    async create_order(req, res) {
        try {
            const { user_id } = req.user;
            const { shippingAddress } = req.body;

            const cart = await Cart.findOne({ user: userId }).populate('items.product');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: "Your cart is empty" });
            }
            const orderItems = cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            }));

            const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            const newOrder = new Order({
                user: userId,
                items: orderItems,
                totalAmount,
                shippingAddress,
                status: 'Pending',
                paymentStatus: 'Unpaid'
            });

            const savedOrder = await newOrder.save();

            await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

            res.status(201).json({
                message: "Order placed successfully",
                orderId: savedOrder._id,
                total: savedOrder.totalAmount
            });

        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
}