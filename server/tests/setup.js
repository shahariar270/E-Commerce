// Point DB_URL at an isolated test database *before* config/env's dotenv
// call runs — dotenv never overrides an already-set process.env var, so
// this keeps every test run off the real dev database at
// mongodb://127.0.0.1:27017/e_commerce.
process.env.DB_URL = process.env.TEST_DB_URL || 'mongodb://127.0.0.1:27017/e_commerce_test';
require('../config/env');

const mongoose = require('mongoose');

// Real email sending (Mailtrap SMTP) is slow, network-dependent, and not
// what any of these tests are asserting on — replace it everywhere a
// controller requires '../../config/sender'.
jest.mock('../config/sender', () => jest.fn().mockResolvedValue(undefined));

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
});

afterEach(async () => {
    const { collections } = mongoose.connection;
    await Promise.all(
        Object.values(collections).map((collection) => collection.deleteMany({}))
    );
});

afterAll(async () => {
    await mongoose.connection.close();
});
