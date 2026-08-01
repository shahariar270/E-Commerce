const request = require('supertest');
const buildTestApp = require('./testApp');
const { createAdmin, createUser, issueToken } = require('./fixtures');

const app = buildTestApp();

describe('GET/PUT /api/admin/customers', () => {
    test('a non-admin cannot list customers', async () => {
        const { user } = await createUser();
        const token = issueToken(user);

        const res = await request(app).get('/api/admin/customers').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(403);
    });

    test('an admin can list customers and toggle an account\'s active status', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);
        const { user: customer } = await createUser();

        const list = await request(app).get('/api/admin/customers').set('Authorization', `Bearer ${adminToken}`);
        expect(list.status).toBe(200);
        expect(list.body.data.total).toBeGreaterThanOrEqual(1);

        const disable = await request(app)
            .put(`/api/admin/customers/${customer._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ is_active: false });
        expect(disable.status).toBe(200);
        expect(disable.body.data.is_active).toBe(false);

        // A disabled account can no longer log in.
        const loginAttempt = await request(app).post('/auth/login').send({
            email: customer.email,
            password: 'Password123!',
        });
        expect(loginAttempt.status).toBe(403);
    });

    test('an admin cannot disable their own account', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);

        const res = await request(app)
            .put(`/api/admin/customers/${admin._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ is_active: false });

        expect(res.status).toBe(400);
    });
});

describe('GET/PUT /api/settings', () => {
    test('a non-admin cannot read settings', async () => {
        const { user } = await createUser();
        const token = issueToken(user);

        const res = await request(app).get('/api/settings').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(403);
    });

    test('reports schema defaults when no settings document exists yet', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);

        const res = await request(app).get('/api/settings').set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.require_guest_email_verification).toBe(true);
    });

    test('an admin can update and persist the guest-verification toggle', async () => {
        const { user: admin } = await createAdmin();
        const adminToken = issueToken(admin);

        const update = await request(app)
            .put('/api/settings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ require_guest_email_verification: false });
        expect(update.status).toBe(200);
        expect(update.body.data.require_guest_email_verification).toBe(false);

        const reread = await request(app).get('/api/settings').set('Authorization', `Bearer ${adminToken}`);
        expect(reread.body.data.require_guest_email_verification).toBe(false);
    });
});
