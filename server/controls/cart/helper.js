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

module.exports = calculateTotals;