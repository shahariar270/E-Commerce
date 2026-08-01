const Coupon = require("../../model/coupon");
const Cart = require("../../model/cart");
const ApiResponse = require("../../utils/api_response");
const { calculateTotals } = require("../cart/helper");

// req.user is set by auth_middleware.identify — either a logged-in user
// (id set) or a guest (guest_id set). Exactly one of the two identifies
// which cart to operate on.
const ownerFilter = (req) => req.user.id ? { user_id: req.user.id } : { guest_id: req.user.guest_id };

class coupon_controller {
    async create_coupon(req, res) {
        try {
            const {
                code,
                discount_type,
                discount_value,
                max_discount_amount,
                min_purchase_amount,
                usage_limit,
                expiry_date,
                is_active,
                auto_apply,
            } = req.body;
            const user_id = req.user.id;

            if (!code || !discount_type || discount_value === undefined || !expiry_date) {
                return ApiResponse.error(res, "Code, discount type, discount value and expiry date are required", 400);
            }

            if (!['percentage', 'fixed'].includes(discount_type)) {
                return ApiResponse.error(res, "Discount type must be 'percentage' or 'fixed'", 400);
            }

            const normalized_code = code.trim().toUpperCase();
            const existing = await Coupon.findOne({ code: normalized_code });
            if (existing) {
                return ApiResponse.error(res, "A coupon with this code already exists", 400);
            }

            const new_coupon = await Coupon.create({
                code: normalized_code,
                discount_type,
                discount_value,
                max_discount_amount: max_discount_amount || null,
                min_purchase_amount: min_purchase_amount || 0,
                usage_limit: usage_limit || null,
                expiry_date,
                is_active,
                auto_apply,
                user_id,
            });

            return ApiResponse.success(res, "Coupon created successfully", new_coupon, 201);
        } catch (error) {
            return ApiResponse.error(res, "Error creating coupon", 500, error.message);
        }
    }

    async get_coupons(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const coupons = await Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
            const total = await Coupon.countDocuments();
            return ApiResponse.success(res, "Coupons retrieved successfully", {
                data: coupons,
                total,
            });
        } catch (error) {
            return ApiResponse.error(res, "Error retrieving coupons", 500, error.message);
        }
    }

    async get_coupon_by_id(req, res) {
        try {
            const { id } = req.params;
            const coupon = await Coupon.findById(id);
            if (!coupon) {
                return ApiResponse.error(res, "Coupon not found", 404);
            }
            return ApiResponse.success(res, "Coupon retrieved successfully", coupon);
        } catch (error) {
            return ApiResponse.error(res, "Error retrieving coupon", 500, error.message);
        }
    }

    async update_coupon(req, res) {
        try {
            const { id } = req.params;
            const {
                code,
                discount_type,
                discount_value,
                max_discount_amount,
                min_purchase_amount,
                usage_limit,
                expiry_date,
                is_active,
                auto_apply,
            } = req.body;

            if (discount_type && !['percentage', 'fixed'].includes(discount_type)) {
                return ApiResponse.error(res, "Discount type must be 'percentage' or 'fixed'", 400);
            }

            const update = {
                discount_type,
                discount_value,
                max_discount_amount: max_discount_amount || null,
                min_purchase_amount,
                usage_limit: usage_limit || null,
                expiry_date,
                is_active,
                auto_apply,
            };

            if (code) {
                const normalized_code = code.trim().toUpperCase();
                const existing = await Coupon.findOne({ code: normalized_code, _id: { $ne: id } });
                if (existing) {
                    return ApiResponse.error(res, "A coupon with this code already exists", 400);
                }
                update.code = normalized_code;
            }

            const updated_coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });
            if (!updated_coupon) {
                return ApiResponse.error(res, "Coupon not found", 404);
            }
            return ApiResponse.success(res, "Coupon updated successfully", updated_coupon);
        } catch (error) {
            return ApiResponse.error(res, "Error updating coupon", 500, error.message);
        }
    }

    async delete_coupon(req, res) {
        try {
            const { id } = req.params;
            const deleted_coupon = await Coupon.findByIdAndDelete(id);
            if (!deleted_coupon) {
                return ApiResponse.error(res, "Coupon not found", 404);
            }
            return ApiResponse.success(res, "Coupon deleted successfully", deleted_coupon);
        } catch (error) {
            return ApiResponse.error(res, "Error deleting coupon", 500, error.message);
        }
    }

    async apply_coupon(req, res) {
        try {
            const { code } = req.body;

            if (!code) {
                return ApiResponse.error(res, "Coupon code is required", 400);
            }

            const cart = await Cart.findOne(ownerFilter(req));
            if (!cart || cart.items.length === 0) {
                return ApiResponse.error(res, "Your cart is empty", 400);
            }

            const normalized_code = code.trim().toUpperCase();
            const coupon = await Coupon.findOne({ code: normalized_code });

            if (!coupon) {
                return ApiResponse.error(res, "Invalid coupon code", 404);
            }
            if (!coupon.is_active) {
                return ApiResponse.error(res, "This coupon is no longer active", 400);
            }
            if (coupon.expiry_date < new Date()) {
                return ApiResponse.error(res, "This coupon has expired", 400);
            }
            if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
                return ApiResponse.error(res, "This coupon has reached its usage limit", 400);
            }
            if (cart.total_price < coupon.min_purchase_amount) {
                return ApiResponse.error(res, `Minimum purchase of $${coupon.min_purchase_amount.toFixed(2)} required for this coupon`, 400);
            }

            cart.coupon = {
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
                max_discount_amount: coupon.max_discount_amount,
                discount_amount: 0,
                auto_applied: false,
            };

            calculateTotals(cart);
            await cart.save();

            const populatedCart = await Cart.findById(cart._id).populate("items.product_id");
            return ApiResponse.success(res, "Coupon applied successfully", populatedCart);
        } catch (error) {
            return ApiResponse.error(res, "Error applying coupon", 500, error.message);
        }
    }

    async remove_coupon(req, res) {
        try {
            const cart = await Cart.findOne(ownerFilter(req));
            if (!cart) {
                return ApiResponse.error(res, "Cart not found", 404);
            }

            cart.coupon = { code: null, discount_type: null, discount_value: null, max_discount_amount: null, discount_amount: 0, auto_applied: false };
            calculateTotals(cart);
            await cart.save();

            const populatedCart = await Cart.findById(cart._id).populate("items.product_id");
            return ApiResponse.success(res, "Coupon removed", populatedCart);
        } catch (error) {
            return ApiResponse.error(res, "Error removing coupon", 500, error.message);
        }
    }
}

module.exports = new coupon_controller;
