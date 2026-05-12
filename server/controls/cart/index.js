const Cart = require("../../model/cart");
const ApiResponse = require("../../utils/api_response");
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
            return ApiResponse.success(res, "Item added to cart", cart, 201);

        } catch (error) {
            return ApiResponse.error(res, "Error adding to cart", 500, error.message);
        }
    }
    async get_cart(req, res) {
        try {
            const { id: user_id } = req.user;
            const cart = await Cart.findOne({ user_id })
                .populate("items.product_id");

            if (!cart) return ApiResponse.error(res, "Cart is empty", 404);
            return ApiResponse.success(res, "Cart fetched successfully", cart);
        } catch (error) {
            return ApiResponse.error(res, "Error fetching cart", 500, error.message);
        }
    }
    async updated_cart(req, res) {
        const { id: user_id } = req.user;
        const { product_id, quantity } = req.body;

        try {
            const cart = await Cart.findOne({ user_id });
            if (!cart) return ApiResponse.error(res, "Cart not found", 404);

            const item = cart.items.find(p => p.product_id.toString() === product_id);
            if (item) {
                item.quantity = quantity;
                item.subtotal = item.price * quantity;

                calculateTotals(cart);
                await cart.save();

                // Populate product_id before returning
                const populatedCart = await Cart.findById(cart._id).populate("items.product_id");
                return ApiResponse.success(res, "Cart updated successfully", populatedCart);
            } else {
                return ApiResponse.error(res, "Item not found in cart", 404);
            }
        } catch (error) {
            return ApiResponse.error(res, "Error updating quantity", 500, error.message);
        }
    }

    async remove_item_from_cart(req, res) {
        const { id: user_id } = req.user;
        const { id } = req.params;

        try {
            const cart = await Cart.findOne({ user_id });
            if (!cart) return ApiResponse.error(res, "Cart not found", 404);

            cart.items = cart.items.filter(item => item.product_id.toString() !== id);

            calculateTotals(cart);
            await cart.save();

            // Populate product_id before returning
            const populatedCart = await Cart.findById(cart._id).populate("items.product_id");
            return ApiResponse.success(res, "Item removed from cart", populatedCart);
        } catch (error) {
            return ApiResponse.error(res, "Error removing item", 500, error.message);
        }
    }


}

module.exports = new cart_system;