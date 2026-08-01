const request = require('supertest');
const buildTestApp = require('./testApp');
const Cart = require('../model/cart');
const Product = require('../model/product');
const Order = require('../model/order');
const EmailVerification = require('../model/emailVerification');
const { createUser, createAdmin, issueToken, createProduct, guestId } = require('./fixtures');

const app = buildTestApp();

const VALID_ADDRESS = {
    name: 'Jane Buyer',
    phone: '01712345678',
    address: '123 Test Street',
    city: 'Dhaka',
    postalCode: '1200',
};

const buildCartFor = async (filter, items) => Cart.create({
    ...filter,
    items: items.map((i) => ({
        product_id: i.product._id,
        name: i.product.product_name,
        price: Number(i.product.price),
        quantity: i.quantity,
        subtotal: Number(i.product.price) * i.quantity,
    })),
});

describe('POST /api/order (create_order)', () => {
    test('decrements stock and empties the cart on success', async () => {
        const { user } = await createUser();
        const token = issueToken(user);
        const product = await createProduct({ stock: 10, price: '20' });
        await buildCartFor({ user_id: user._id }, [{ product, quantity: 3 }]);

        const res = await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ shippingAddress: VALID_ADDRESS });

        expect(res.status).toBe(201);

        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.stock).toBe(7); // 10 - 3

        const cart = await Cart.findOne({ user_id: user._id });
        expect(cart).toBeNull(); // deleted after a successful order

        const order = await Order.findOne({ user: user._id });
        expect(order.totalAmount).toBe(60);
        expect(order.status).toBe('pending');
    });

    test('rejects an invalid (non-Bangladeshi) phone number', async () => {
        const { user } = await createUser();
        const token = issueToken(user);
        const product = await createProduct({ stock: 10, price: '20' });
        await buildCartFor({ user_id: user._id }, [{ product, quantity: 1 }]);

        const res = await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ shippingAddress: { ...VALID_ADDRESS, phone: '5551234' } });

        expect(res.status).toBe(400);
    });

    test('rejects when the cart is empty', async () => {
        const { user } = await createUser();
        const token = issueToken(user);

        const res = await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ shippingAddress: VALID_ADDRESS });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/cart is empty/i);
    });

    test('rolls back stock already decremented when a later item in the same order fails', async () => {
        const { user } = await createUser();
        const token = issueToken(user);
        const roomy = await createProduct({ stock: 10, price: '10' }); // enough stock
        const tight = await createProduct({ stock: 1, price: '10' }); // cart wants more than this has
        await buildCartFor({ user_id: user._id }, [
            { product: roomy, quantity: 2 },
            { product: tight, quantity: 5 },
        ]);

        const res = await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ shippingAddress: VALID_ADDRESS });

        expect(res.status).toBe(400);

        // The first item's decrement must have been rolled back, not left applied.
        const roomyAfter = await Product.findById(roomy._id);
        expect(roomyAfter.stock).toBe(10);

        const tightAfter = await Product.findById(tight._id);
        expect(tightAfter.stock).toBe(1);

        // And no order or stock change should have gone through at all.
        const order = await Order.findOne({ user: user._id });
        expect(order).toBeNull();
    });

    test('a guest checkout is blocked until their email is verified (default setting)', async () => {
        const product = await createProduct({ stock: 10, price: '20' });
        const gid = guestId();
        await buildCartFor({ guest_id: gid }, [{ product, quantity: 1 }]);

        const res = await request(app)
            .post('/api/order')
            .set('X-Guest-Id', gid)
            .send({ shippingAddress: VALID_ADDRESS, email: 'guest@test.local' });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/verify your email/i);
    });

    test('a guest with a verified email can check out', async () => {
        const product = await createProduct({ stock: 10, price: '20' });
        const gid = guestId();
        await buildCartFor({ guest_id: gid }, [{ product, quantity: 1 }]);
        await EmailVerification.create({
            guest_id: gid,
            email: 'verified-guest@test.local',
            code: '123456',
            verified: true,
            expires_at: new Date(Date.now() + 600000),
        });

        const res = await request(app)
            .post('/api/order')
            .set('X-Guest-Id', gid)
            .send({ shippingAddress: VALID_ADDRESS, email: 'verified-guest@test.local' });

        expect(res.status).toBe(201);
    });
});

describe('order cancellation / deletion restocks inventory', () => {
    const placeOrder = async (product, quantity) => {
        const { user } = await createUser();
        const token = issueToken(user);
        await buildCartFor({ user_id: user._id }, [{ product, quantity }]);
        await request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ shippingAddress: VALID_ADDRESS });
        return Order.findOne({ user: user._id });
    };

    test('deleting an order restores the reserved stock', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);
        const product = await createProduct({ stock: 10, price: '15' });

        const order = await placeOrder(product, 4);
        expect((await Product.findById(product._id)).stock).toBe(6);

        const res = await request(app)
            .delete(`/api/admin/order/${order._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect((await Product.findById(product._id)).stock).toBe(10);
    });

    test('cancelling an order restores the reserved stock exactly once', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);
        const product = await createProduct({ stock: 10, price: '15' });

        const order = await placeOrder(product, 4);
        expect((await Product.findById(product._id)).stock).toBe(6);

        const first = await request(app)
            .put(`/api/admin/order/${order._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'cancelled' });
        expect(first.status).toBe(200);
        expect((await Product.findById(product._id)).stock).toBe(10);

        // Setting the same status again (or any further update) must not
        // restock a second time — stock_restored guards against a double-credit.
        const second = await request(app)
            .put(`/api/admin/order/${order._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'cancelled' });
        expect(second.status).toBe(200);
        expect((await Product.findById(product._id)).stock).toBe(10);
    });

    test('a non-admin cannot delete or update orders', async () => {
        const { user } = await createUser();
        const token = issueToken(user);
        const product = await createProduct({ stock: 10, price: '15' });
        const order = await placeOrder(product, 1);

        const res = await request(app)
            .delete(`/api/admin/order/${order._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(403);
    });
});
