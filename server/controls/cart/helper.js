const Coupon = require("../../model/coupon");

const calculateTotals = (cart) => {
    if (!cart.items || cart.items.length === 0) {
        cart.total_quantity = 0;
        cart.total_price = 0;
    } else {
        cart.total_quantity = cart.items.reduce(
            (acc, item) => acc + (item.quantity || 0),
            0
        );

        cart.total_price = cart.items.reduce(
            (acc, item) => acc + (item.subtotal || 0),
            0
        );
    }

    if (cart.coupon?.code && cart.total_price > 0) {
        let discount = cart.coupon.discount_type === 'percentage'
            ? (cart.total_price * cart.coupon.discount_value) / 100
            : cart.coupon.discount_value;

        if (cart.coupon.max_discount_amount) {
            discount = Math.min(discount, cart.coupon.max_discount_amount);
        }
        discount = Math.min(discount, cart.total_price);
        cart.coupon.discount_amount = Math.round(discount * 100) / 100;
    } else if (cart.coupon) {
        cart.coupon.discount_amount = 0;
    }

    cart.grand_total = Math.max(
        0,
        Math.round((cart.total_price - (cart.coupon?.discount_amount || 0)) * 100) / 100
    );
};

const isCouponEligible = (coupon, cartTotal) => {
    if (!coupon) return false;
    if (!coupon.is_active) return false;
    if (coupon.expiry_date < new Date()) return false;
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined && coupon.used_count >= coupon.usage_limit) return false;
    if (cartTotal < (coupon.min_purchase_amount || 0)) return false;
    return true;
};

const discountAmountFor = (coupon, cartTotal) => {
    let discount = coupon.discount_type === 'percentage'
        ? (cartTotal * coupon.discount_value) / 100
        : coupon.discount_value;

    if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
    }
    return Math.min(discount, cartTotal);
};

const findBestAutoCoupon = async (cartTotal) => {
    const candidates = await Coupon.find({
        auto_apply: true,
        is_active: true,
        expiry_date: { $gte: new Date() },
        min_purchase_amount: { $lte: cartTotal },
    });

    const eligible = candidates.filter((c) => isCouponEligible(c, cartTotal));

    if (eligible.length === 0) return null;

    return eligible.reduce((best, c) =>
        discountAmountFor(c, cartTotal) > discountAmountFor(best, cartTotal) ? c : best
    );
};

const clearCartCoupon = (cart) => {
    cart.coupon = {
        code: null,
        discount_type: null,
        discount_value: null,
        max_discount_amount: null,
        discount_amount: 0,
        auto_applied: false,
    };
};

// The cart stores a snapshot of the coupon's discount at the moment it was
// applied, so if an admin edits the coupon afterwards (discount value,
// active state, expiry, min purchase) a cart already carrying it would keep
// using the stale numbers forever. Re-sync from the live Coupon record on
// every cart read, and drop it if it's no longer valid for this cart.
const refreshCartCoupon = async (cart) => {
    if (!cart.coupon?.code) return;

    const live = await Coupon.findOne({ code: cart.coupon.code });

    if (!isCouponEligible(live, cart.total_price)) {
        clearCartCoupon(cart);
        return;
    }

    cart.coupon.discount_type = live.discount_type;
    cart.coupon.discount_value = live.discount_value;
    cart.coupon.max_discount_amount = live.max_discount_amount;
};

// Applies the best eligible auto-apply coupon to the cart, unless the
// customer already has a coupon of their own applied (cart.coupon.auto_applied
// tells the two cases apart). Call after calculateTotals has set
// cart.total_price, then call calculateTotals again to price the discount in.
const applyAutoCoupon = async (cart) => {
    if (cart.coupon?.code && !cart.coupon.auto_applied) return;

    if (!cart.total_price || cart.total_price <= 0) {
        if (cart.coupon?.auto_applied) clearCartCoupon(cart);
        return;
    }

    const best = await findBestAutoCoupon(cart.total_price);

    if (!best) {
        if (cart.coupon?.auto_applied) clearCartCoupon(cart);
        return;
    }

    if (cart.coupon?.code === best.code) return;

    cart.coupon = {
        code: best.code,
        discount_type: best.discount_type,
        discount_value: best.discount_value,
        max_discount_amount: best.max_discount_amount,
        discount_amount: 0,
        auto_applied: true,
    };
};

module.exports = calculateTotals;
module.exports.calculateTotals = calculateTotals;
module.exports.refreshCartCoupon = refreshCartCoupon;
module.exports.applyAutoCoupon = applyAutoCoupon;
