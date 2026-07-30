const request = require('supertest');
const buildTestApp = require('./testApp');
const { createUser, issueToken, createProduct, guestId } = require('./fixtures');

const app = buildTestApp();

describe('POST /api/cart (create/add)', () => {
    test('a guest can add an item using X-Guest-Id, no account required', async () => {
        const product = await createProduct({ stock: 10, price: '25' });
        const gid = guestId();

        const res = await request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 25, quantity: 2 });

        expect(res.status).toBe(201);
        expect(res.body.data.total_quantity).toBe(2);
        expect(res.body.data.total_price).toBe(50);
    });

    test('rejects a request with neither a token nor a guest id', async () => {
        const product = await createProduct();
        const res = await request(app)
            .post('/api/cart')
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        expect(res.status).toBe(400);
    });

    test('adding the same product twice accumulates quantity instead of duplicating the line item', async () => {
        const product = await createProduct({ stock: 10, price: '10' });
        const gid = guestId();
        const add = () => request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        await add();
        const res = await add();

        expect(res.body.data.items).toHaveLength(1);
        expect(res.body.data.items[0].quantity).toBe(2);
    });

    test('rejects adding more than the available stock', async () => {
        const product = await createProduct({ stock: 3, price: '10' });
        const gid = guestId();

        const res = await request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 5 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/only 3 left in stock/i);
    });

    test('rejects adding a product with zero stock', async () => {
        const product = await createProduct({ stock: 0, price: '10' });
        const gid = guestId();

        const res = await request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/out of stock/i);
    });

    test('two additions that individually fit but together exceed stock are rejected on the second call', async () => {
        const product = await createProduct({ stock: 5, price: '10' });
        const gid = guestId();
        const add = (quantity) => request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity });

        const first = await add(3);
        expect(first.status).toBe(201);

        const second = await add(3); // 3 + 3 = 6 > 5 in stock
        expect(second.status).toBe(400);

        // Cart must still only reflect the first, successful addition.
        const cartRes = await request(app).get('/api/cart').set('X-Guest-Id', gid);
        expect(cartRes.body.data.total_quantity).toBe(3);
    });

    test('a guest cart and a logged-in user cart never see each other\'s items', async () => {
        const { user } = await createUser();
        const token = issueToken(user);
        const product = await createProduct({ stock: 20, price: '10' });
        const gid = guestId();

        await request(app)
            .post('/api/cart')
            .set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        const userCart = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(userCart.status).toBe(404); // logged-in user has no cart of their own yet
    });
});

describe('GET /api/cart', () => {
    test('404s when there is no cart yet', async () => {
        const res = await request(app).get('/api/cart').set('X-Guest-Id', guestId());
        expect(res.status).toBe(404);
    });
});

describe('PUT /api/cart (update quantity)', () => {
    test('updates the quantity of an existing item', async () => {
        const product = await createProduct({ stock: 10, price: '10' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        const res = await request(app).put('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), quantity: 4 });

        expect(res.status).toBe(200);
        expect(res.body.data.items[0].quantity).toBe(4);
        expect(res.body.data.total_price).toBe(40);
    });

    test('rejects updating past the available stock', async () => {
        const product = await createProduct({ stock: 5, price: '10' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        const res = await request(app).put('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), quantity: 99 });

        expect(res.status).toBe(400);
    });

    test('404s for a product that is not in the cart', async () => {
        const product = await createProduct({ stock: 5, price: '10' });
        const other = await createProduct({ stock: 5, price: '10' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 1 });

        const res = await request(app).put('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: other._id.toString(), quantity: 2 });

        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/cart/:id (remove item)', () => {
    test('removes the item and recalculates totals', async () => {
        const product = await createProduct({ stock: 10, price: '10' });
        const gid = guestId();
        await request(app).post('/api/cart').set('X-Guest-Id', gid)
            .send({ product_id: product._id.toString(), name: product.product_name, price: 10, quantity: 2 });

        const res = await request(app).delete(`/api/cart/${product._id}`).set('X-Guest-Id', gid);

        expect(res.status).toBe(200);
        expect(res.body.data.items).toHaveLength(0);
        expect(res.body.data.total_quantity).toBe(0);
        expect(res.body.data.total_price).toBe(0);
    });
});
