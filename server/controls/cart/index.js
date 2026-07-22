const Cart = require("../../model/cart");
const Product = require("../../model/product");
const ApiResponse = require("../../utils/api_response");
const calculateTotals = require("./helper");

// req.user is set by auth_middleware.identify — either a logged-in user
// (id set) or a guest (guest_id set). Exactly one of the two identifies
// which cart to operate on.
const ownerFilter = (req) => req.user.id ? { user_id: req.user.id } : { guest_id: req.user.guest_id };

class cart_system {
    async create_cart(req, res) {
        try {
            const { product_id, name, price, quantity } = req.body;
            const filter = ownerFilter(req);

            const product = await Product.findById(product_id);
            if (!product) return ApiResponse.error(res, "Product not found", 404);

            let cart = await Cart.findOne(filter);

            const totalPrice = price * quantity;
            const existingItem = cart?.items.find(p => p.product_id.toString() === product_id);
            const resultingQuantity = (existingItem?.quantity || 0) + quantity;
            // Documents saved before stock existed on the schema have it
            // completely absent (not 0) — comparing a number against
            // undefined is always false in JS, which would silently let the
            // check below pass. Coerce to a real number first.
            const availableStock = Number(product.stock) || 0;

            if (resultingQuantity > availableStock) {
                return ApiResponse.error(
                    res,
                    availableStock > 0
                        ? `Only ${availableStock} left in stock`
                        : "This product is out of stock",
                    400
                );
            }

            if (cart) {
                if (existingItem) {
                    existingItem.quantity = resultingQuantity;
                    existingItem.subtotal = existingItem.quantity * price;
                } else {
                    cart.items.push({ product_id, name, price, quantity, subtotal: totalPrice });
                }

            } else {
                cart = new Cart({
                    ...filter,
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
            const cart = await Cart.findOne(ownerFilter(req))
                .populate("items.product_id");

            if (!cart) return ApiResponse.error(res, "Cart is empty", 404);
            return ApiResponse.success(res, "Cart fetched successfully", cart);
        } catch (error) {
            return ApiResponse.error(res, "Error fetching cart", 500, error.message);
        }
    }
    async updated_cart(req, res) {
        const { product_id, quantity } = req.body;

        try {
            const cart = await Cart.findOne(ownerFilter(req));
            if (!cart) return ApiResponse.error(res, "Cart not found", 404);

            const item = cart.items.find(p => p.product_id.toString() === product_id);
            if (item) {
                const product = await Product.findById(product_id);
                if (!product) return ApiResponse.error(res, "Product not found", 404);
                const availableStock = Number(product.stock) || 0;
                if (quantity > availableStock) {
                    return ApiResponse.error(
                        res,
                        availableStock > 0
                            ? `Only ${availableStock} left in stock`
                            : "This product is out of stock",
                        400
                    );
                }

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
        const { id } = req.params;

        try {
            const cart = await Cart.findOne(ownerFilter(req));
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
