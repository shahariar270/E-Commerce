const request = require('supertest');
const buildTestApp = require('./testApp');
const Cart = require('../model/cart');
const Coupon = require('../model/coupon');
const { createAdmin, createUser, issueToken, createProduct, guestId } = require('./fixtures');

const app = buildTestApp();

describe('Coupon admin CRUD (POST/GET/PUT/DELETE /api/coupon)', () => {
    test('a non-admin cannot create a coupon', async () => {
        const { user } = await createUser();
        const token = issueToken(user);

        const res = await request(app)
            .post('/api/coupon')
            .set('Authorization', `Bearer ${token}`)
            .send({ code: 'NOPE', discount_type: 'fixed', discount_value: 5, expiry_date: new Date(Date.now() + 86400000) });

        expect(res.status).toBe(403);
    });

    test('an admin can create, fetch, update, and delete a coupon', async () => {
        const { user: admin } = await createAdmin();
        const token = issueToken(admin);

        const create = await request(app)
            .post('/api/coupon')
            .set('Authorization', `Bearer ${token}`)
            .send({
                code: 'save10', // lowercase on input — should be normalized
                discount_type: 'percentage',
                discount_value: 10,
                expiry_date: new Date(Date.now() + 86400000),
            });
        expect(create.status).toBe(201);
        expect(create.body.data.code).toBe('SAVE10');

        const id = create.body.data._id;

        const getOne = await request(app).get(`/api/coupon/${id}`).set('Authorization', `Bearer ${token}`);
        expect(getOne.status).toBe(200);

        const update = await request(app)
            .put(`/api/coupon/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ discount_value: 20 });
        expect(update.status).toBe(200);
        expect(update.body.data.discount_value).toBe(20);

        const del = await request(app).delete(`/api/coupon/${id}`).set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(200);

        const getAfterDelete = await request(app).get(`/api/coupon/${id}`).set('Authorization', `Bearer ${token}`);
        expect(getAfterDelete.status).toBe(404);
    });

    test('rejects creating a coupon with a code that already exists', async () => {
        const { user: admin } = await createAdmin();
        const token = issueToken(admin);
        await Coupon.create({ code: 'DUPE', discount_type: 'fixed', discount_value: 5, expiry_date: new Date(Date.now() + 86400000), user_id: 'admin1' });

        const res = await request(app)
            .post('/api/coupon')
            .set('Authorization', `Bearer ${token}`)
            .send({ code: 'dupe', discount_type: 'fixed', discount_value: 1, expiry_date: new Date(Date.now() + 86400000) });

        expect(res.status).toBe(400);
    });
});

describe('POST/DELETE /api/coupon/apply', () => {
    test('applies a valid coupon to the cart and prices the discount in', async () => {
        await Coupon.create({ code: 'TEN', discount_type: 'percentage', discount_value: 10, expiry_date: new Date(Date.now() + 86400000), user_id: 'admin1x' });
        const product = await createProduct({ stock: 10, price: '100' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 100, quantity: 1 });

        const res = await request(app).post('/api/coupon/apply').set('X-Guest-Id', gid).send({ code: 'ten' });

        expect(res.status).toBe(200);
        expect(res.body.data.coupon.code).toBe('TEN');
        expect(res.body.data.grand_total).toBe(90);
    });

    test('rejects an unknown coupon code', async () => {
        const product = await createProduct({ stock: 10, price: '100' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 100, quantity: 1 });

        const res = await request(app).post('/api/coupon/apply').set('X-Guest-Id', gid).send({ code: 'DOESNOTEXIST' });

        expect(res.status).toBe(404);
    });

    test('rejects a coupon below its minimum purchase amount', async () => {
        await Coupon.create({ code: 'MIN500', discount_type: 'fixed', discount_value: 10, min_purchase_amount: 500, expiry_date: new Date(Date.now() + 86400000), user_id: 'admin1x' });
        const product = await createProduct({ stock: 10, price: '20' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 20, quantity: 1 });

        const res = await request(app).post('/api/coupon/apply').set('X-Guest-Id', gid).send({ code: 'MIN500' });

        expect(res.status).toBe(400);
    });

    test('removes an applied coupon', async () => {
        await Coupon.create({ code: 'REMOVEME', discount_type: 'fixed', discount_value: 5, expiry_date: new Date(Date.now() + 86400000), user_id: 'admin1x' });
        const product = await createProduct({ stock: 10, price: '100' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 100, quantity: 1 });
        await request(app).post('/api/coupon/apply').set('X-Guest-Id', gid).send({ code: 'REMOVEME' });

        const res = await request(app).delete('/api/coupon/apply').set('X-Guest-Id', gid);

        expect(res.status).toBe(200);
        expect(res.body.data.coupon.code).toBeNull();
        expect(res.body.data.grand_total).toBe(100);
    });
});
