const Cart = require("../../model/cart");
const calculateTotals = require("./helper");


class cart_system {
    async create_cart(req, res) {
        try {
            const { product_id, name, price, quantity } = req.body;
            const { id: user_id } = req.user;
            let cart = await Cart.findOne({ user_id });

            const totalPrice = price * quantity;

            if (cart) {
                const itemIndex = cart.items.findIndex(p => p.product_id.toString() === product_id);

                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                    cart.items[itemIndex].subtotal = cart.items[itemIndex].quantity * price;
                } else {
                    cart.items.push({ product_id, name, price, quantity, subtotal: totalPrice });
                }

            } else {
                cart = new Cart({
                    user_id,
                    items: [{ product_id, name, price, quantity, subtotal: totalPrice }]
                });
            }

            calculateTotals(cart);
            await cart.save();
            res.status(201).json(cart);

        } catch (error) {
            res.status(500).json({ message: "Error adding to cart", error: error.message });
        }
    }
    async get_cart(req, res) {
        try {
            const { id: user_id } = req.user;
            const cart = await Cart.findOne({ user_id })
                .populate("items.product_id");

            if (!cart) return res.status(404).json({ message: "Cart is empty" });
            return res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: "Error fetching cart", error: error.message });
        }
    }
    async updated_cart(req, res) {
        const { id: user_id } = req.user;
        const { product_id, quantity } = req.body;

        try {
            const cart = await Cart.findOne({ user_id });
            if (!cart) return res.status(404).json({ message: "Cart not found" });

            const item = cart.items.find(p => p.product_id.toString() === product_id);
            if (item) {
                item.quantity = quantity;
                item.subtotal = item.price * quantity;

                calculateTotals(cart);
                await cart.save();
                res.status(200).json(cart);
            } else {
                res.status(404).json({ message: "Item not found in cart" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating quantity", error });
        }
    }

    async remove_item_from_cart(req, res) {
        const { id: user_id } = req.user;
        const { id } = req.params;

        try {
            const cart = await Cart.findOne({ user_id });
            if (!cart) return res.status(404).json({ message: "Cart not found" });

            cart.items = cart.items.filter(item => item.product_id.toString() !== id);

            calculateTotals(cart);
            await cart.save();
            return res.status(200).json({ message: "Item removed", cart });
        } catch (error) {
            res.status(500).json({ message: "Error removing item", error : error.message });
        }
    }


}

module.exports = new cart_system;