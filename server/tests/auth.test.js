const request = require('supertest');
const bcrypt = require('bcrypt');
const buildTestApp = require('./testApp');
const User = require('../model/auth');
const PasswordReset = require('../model/passwordReset');
const { createUser, guestId } = require('./fixtures');

const app = buildTestApp();

describe('POST /auth/register', () => {
    test('creates a new user', async () => {
        const res = await request(app).post('/auth/register').send({
            user_name: 'jdoe',
            email: 'jdoe@test.local',
            password: 'Password123!',
            first_name: 'John',
            last_name: 'Doe',
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        const stored = await User.findOne({ email: 'jdoe@test.local' }).select('+password');
        expect(stored).not.toBeNull();
        expect(stored.password).not.toBe('Password123!'); // hashed, not plaintext
        expect(stored.user_role).toBe('buyer'); // never trusts a client-supplied role
    });

    test('rejects a duplicate email', async () => {
        await createUser({ email: 'dupe@test.local' });

        const res = await request(app).post('/auth/register').send({
            user_name: 'dupe2',
            email: 'dupe@test.local',
            password: 'Password123!',
            first_name: 'Dup',
            last_name: 'Licate',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('rejects a request body that fails schema validation', async () => {
        const res = await request(app).post('/auth/register').send({
            user_name: 'a', // below the 2-char minimum
            email: 'not-an-email',
            password: '123', // below the 6-char minimum
            first_name: 'A',
            last_name: 'B',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('registration cannot self-promote to admin via the request body', async () => {
        const res = await request(app).post('/auth/register').send({
            user_name: 'wannabe_admin',
            email: 'wannabe@test.local',
            password: 'Password123!',
            first_name: 'Would',
            last_name: 'BeAdmin',
            user_role: 'admin',
        });

        expect(res.status).toBe(201);
        const stored = await User.findOne({ email: 'wannabe@test.local' });
        expect(stored.user_role).toBe('buyer');
    });
});

describe('POST /auth/login', () => {
    test('logs in with correct credentials', async () => {
        const { rawPassword } = await createUser({ email: 'login@test.local' });

        const res = await request(app).post('/auth/login').send({
            email: 'login@test.local',
            password: rawPassword,
        });

        expect(res.status).toBe(200);
        expect(typeof res.body.data.token).toBe('string');
    });

    test('rejects a wrong password', async () => {
        await createUser({ email: 'wrongpass@test.local' });

        const res = await request(app).post('/auth/login').send({
            email: 'wrongpass@test.local',
            password: 'not-the-right-password',
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('rejects a disabled account even with the right password', async () => {
        const { rawPassword } = await createUser({ email: 'disabled@test.local', is_active: false });

        const res = await request(app).post('/auth/login').send({
            email: 'disabled@test.local',
            password: rawPassword,
        });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });

    test('rejects an email that was never registered', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'nobody@test.local',
            password: 'Password123!',
        });

        expect(res.status).toBe(404);
    });
});

describe('POST /auth/forgot-password', () => {
    test('returns the same generic message for a registered email', async () => {
        await createUser({ email: 'forgot@test.local' });

        const res = await request(app).post('/auth/forgot-password').send({ email: 'forgot@test.local' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const record = await PasswordReset.findOne({ email: 'forgot@test.local' });
        expect(record).not.toBeNull();
        expect(record.used).toBe(false);
    });

    test('returns the identical message for an email that was never registered (no enumeration)', async () => {
        const registered = await request(app).post('/auth/forgot-password').send({ email: 'nobody-else@test.local' });
        await createUser({ email: 'exists@test.local' });
        const unregistered = await request(app).post('/auth/forgot-password').send({ email: 'exists@test.local' });

        expect(registered.status).toBe(unregistered.status);
        expect(registered.body.message).toBe(unregistered.body.message);

        // And no reset record should exist for the email that was never registered.
        const record = await PasswordReset.findOne({ email: 'nobody-else@test.local' });
        expect(record).toBeNull();
    });

    test('a second request within the resend cooldown does not rotate the token', async () => {
        await createUser({ email: 'cooldown@test.local' });

        await request(app).post('/auth/forgot-password').send({ email: 'cooldown@test.local' });
        const first = await PasswordReset.findOne({ email: 'cooldown@test.local' });

        await request(app).post('/auth/forgot-password').send({ email: 'cooldown@test.local' });
        const second = await PasswordReset.findOne({ email: 'cooldown@test.local' });

        expect(second.token_hash).toBe(first.token_hash);
    });
});

describe('POST /auth/reset-password', () => {
    const requestReset = async (email) => {
        await request(app).post('/auth/forgot-password').send({ email });
        // The raw token only ever exists in the emailed link — sendMail is
        // mocked, so read the token the controller generated straight from
        // its call args instead of trying to intercept a real email.
        const sendMail = require('../config/sender');
        const call = sendMail.mock.calls.find((c) => c[0].email === email);
        const match = call[0].html.match(/token=([a-f0-9]+)&/);
        return match[1];
    };

    test('resets the password with a valid token', async () => {
        await createUser({ email: 'reset@test.local', password: 'OldPassword123!' });
        const token = await requestReset('reset@test.local');

        const res = await request(app).post('/auth/reset-password').send({
            email: 'reset@test.local',
            token,
            new_password: 'NewPassword123!',
        });

        expect(res.status).toBe(200);

        const login = await request(app).post('/auth/login').send({
            email: 'reset@test.local',
            password: 'NewPassword123!',
        });
        expect(login.status).toBe(200);
    });

    test('the same token cannot be used twice', async () => {
        await createUser({ email: 'reuse@test.local' });
        const token = await requestReset('reuse@test.local');

        const first = await request(app).post('/auth/reset-password').send({
            email: 'reuse@test.local', token, new_password: 'FirstNewPass123!',
        });
        expect(first.status).toBe(200);

        const second = await request(app).post('/auth/reset-password').send({
            email: 'reuse@test.local', token, new_password: 'SecondNewPass123!',
        });
        expect(second.status).toBe(400);
    });

    test('rejects an invalid token', async () => {
        await createUser({ email: 'badtoken@test.local' });
        await requestReset('badtoken@test.local');

        const res = await request(app).post('/auth/reset-password').send({
            email: 'badtoken@test.local',
            token: 'a'.repeat(64),
            new_password: 'NewPassword123!',
        });

        expect(res.status).toBe(400);
    });

    test('rejects an expired token', async () => {
        await createUser({ email: 'expired@test.local' });
        const token = await requestReset('expired@test.local');

        await PasswordReset.findOneAndUpdate(
            { email: 'expired@test.local' },
            { expires_at: new Date(Date.now() - 1000) }
        );

        const res = await request(app).post('/auth/reset-password').send({
            email: 'expired@test.local',
            token,
            new_password: 'NewPassword123!',
        });

        expect(res.status).toBe(400);
    });
});

describe('GET /auth/profile', () => {
    test('requires a token', async () => {
        const res = await request(app).get('/auth/profile');
        expect(res.status).toBe(401);
    });
});
