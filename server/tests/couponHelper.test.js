const { calculateTotals, refreshCartCoupon, applyAutoCoupon } = require('../controls/cart/helper');
const Coupon = require('../model/coupon');

const baseCart = (overrides = {}) => ({
    items: [],
    total_quantity: 0,
    total_price: 0,
    coupon: { code: null, discount_type: null, discount_value: null, max_discount_amount: null, discount_amount: 0, auto_applied: false },
    grand_total: 0,
    ...overrides,
});

describe('calculateTotals', () => {
    test('an empty cart totals to zero', () => {
        const cart = baseCart();
        calculateTotals(cart);
        expect(cart.total_quantity).toBe(0);
        expect(cart.total_price).toBe(0);
        expect(cart.grand_total).toBe(0);
    });

    test('sums quantity and subtotal across items', () => {
        const cart = baseCart({
            items: [
                { quantity: 2, subtotal: 20 },
                { quantity: 1, subtotal: 15 },
            ],
        });
        calculateTotals(cart);
        expect(cart.total_quantity).toBe(3);
        expect(cart.total_price).toBe(35);
        expect(cart.grand_total).toBe(35);
    });

    test('applies a percentage discount', () => {
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 100 }],
            coupon: { code: 'TEN', discount_type: 'percentage', discount_value: 10, max_discount_amount: null, discount_amount: 0, auto_applied: false },
        });
        calculateTotals(cart);
        expect(cart.coupon.discount_amount).toBe(10);
        expect(cart.grand_total).toBe(90);
    });

    test('a percentage discount is capped by max_discount_amount', () => {
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 1000 }],
            coupon: { code: 'BIG', discount_type: 'percentage', discount_value: 50, max_discount_amount: 20, discount_amount: 0, auto_applied: false },
        });
        calculateTotals(cart);
        expect(cart.coupon.discount_amount).toBe(20); // not 500
        expect(cart.grand_total).toBe(980);
    });

    test('a fixed discount never exceeds the cart total (grand_total floors at 0)', () => {
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 15 }],
            coupon: { code: 'FLAT50', discount_type: 'fixed', discount_value: 50, max_discount_amount: null, discount_amount: 0, auto_applied: false },
        });
        calculateTotals(cart);
        expect(cart.coupon.discount_amount).toBe(15);
        expect(cart.grand_total).toBe(0);
    });

    test('discount_amount resets to 0 once the coupon code is cleared', () => {
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 100 }],
            coupon: { code: null, discount_type: null, discount_value: null, max_discount_amount: null, discount_amount: 12.5, auto_applied: false },
        });
        calculateTotals(cart);
        expect(cart.coupon.discount_amount).toBe(0);
        expect(cart.grand_total).toBe(100);
    });
});

describe('refreshCartCoupon', () => {
    test('does nothing when the cart has no coupon applied', async () => {
        const cart = baseCart();
        await expect(refreshCartCoupon(cart)).resolves.toBeUndefined();
        expect(cart.coupon.code).toBeNull();
    });

    test('syncs discount_value from the live coupon record', async () => {
        await Coupon.create({
            code: 'SYNCME', discount_type: 'percentage', discount_value: 10,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        // The cart is carrying a stale snapshot from before an admin edited it.
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 100 }],
            coupon: { code: 'SYNCME', discount_type: 'percentage', discount_value: 10, max_discount_amount: null, discount_amount: 10, auto_applied: false },
            total_price: 100,
        });

        await Coupon.findOneAndUpdate({ code: 'SYNCME' }, { discount_value: 25 });
        await refreshCartCoupon(cart);

        expect(cart.coupon.discount_value).toBe(25);
    });

    test('clears the coupon once it has expired', async () => {
        await Coupon.create({
            code: 'EXPIRED', discount_type: 'fixed', discount_value: 5,
            expiry_date: new Date(Date.now() - 1000), user_id: 'admin-1',
        });
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 100 }],
            coupon: { code: 'EXPIRED', discount_type: 'fixed', discount_value: 5, max_discount_amount: null, discount_amount: 5, auto_applied: false },
            total_price: 100,
        });

        await refreshCartCoupon(cart);

        expect(cart.coupon.code).toBeNull();
    });

    test('clears the coupon once the cart total drops below its minimum purchase', async () => {
        await Coupon.create({
            code: 'MIN50', discount_type: 'fixed', discount_value: 5, min_purchase_amount: 50,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 20 }],
            coupon: { code: 'MIN50', discount_type: 'fixed', discount_value: 5, max_discount_amount: null, discount_amount: 5, auto_applied: false },
            total_price: 20,
        });

        await refreshCartCoupon(cart);

        expect(cart.coupon.code).toBeNull();
    });
});

describe('applyAutoCoupon', () => {
    test('does nothing when there are no auto-apply coupons', async () => {
        const cart = baseCart({ items: [{ quantity: 1, subtotal: 100 }], total_price: 100 });
        await applyAutoCoupon(cart);
        expect(cart.coupon.code).toBeNull();
    });

    test('applies the single eligible auto-apply coupon', async () => {
        await Coupon.create({
            code: 'AUTO10', discount_type: 'percentage', discount_value: 10, auto_apply: true,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        const cart = baseCart({ items: [{ quantity: 1, subtotal: 100 }], total_price: 100 });

        await applyAutoCoupon(cart);

        expect(cart.coupon.code).toBe('AUTO10');
        expect(cart.coupon.auto_applied).toBe(true);
    });

    test('picks whichever eligible auto-apply coupon gives the bigger discount', async () => {
        await Coupon.create({
            code: 'SMALL', discount_type: 'fixed', discount_value: 5, auto_apply: true,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        await Coupon.create({
            code: 'BIGGER', discount_type: 'fixed', discount_value: 15, auto_apply: true,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        const cart = baseCart({ items: [{ quantity: 1, subtotal: 100 }], total_price: 100 });

        await applyAutoCoupon(cart);

        expect(cart.coupon.code).toBe('BIGGER');
    });

    test('does not override a coupon the customer applied manually', async () => {
        await Coupon.create({
            code: 'AUTO', discount_type: 'fixed', discount_value: 50, auto_apply: true,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        const cart = baseCart({
            items: [{ quantity: 1, subtotal: 100 }],
            total_price: 100,
            coupon: { code: 'MANUAL', discount_type: 'fixed', discount_value: 5, max_discount_amount: null, discount_amount: 5, auto_applied: false },
        });

        await applyAutoCoupon(cart);

        expect(cart.coupon.code).toBe('MANUAL');
    });

    test('a coupon below its min_purchase_amount is not applied', async () => {
        await Coupon.create({
            code: 'NEEDS200', discount_type: 'fixed', discount_value: 20, auto_apply: true, min_purchase_amount: 200,
            expiry_date: new Date(Date.now() + 86400000), user_id: 'admin-1',
        });
        const cart = baseCart({ items: [{ quantity: 1, subtotal: 50 }], total_price: 50 });

        await applyAutoCoupon(cart);

        expect(cart.coupon.code).toBeNull();
    });
});
