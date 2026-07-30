const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/auth');
const Product = require('../model/product');
const Category = require('../model/category');
const Cart = require('../model/cart');

let counter = 0;
// google_id has a schema default of null on a sparse-unique index, so a
// second user created without an explicit value collides with the first
// (sparse indexes only skip a field that's truly *absent*, not one that's
// explicitly null — see BRANCH_CHANGES.md's "known pre-existing issue").
// Give every test user a throwaway unique value to sidestep it.
const uniqueGoogleId = () => `test-fixture-${Date.now()}-${counter++}`;

const createUser = async (overrides = {}) => {
    const password = overrides.password || 'Password123!';
    const hashed = await bcrypt.hash(password, 4); // low cost factor — speed, not security, in tests
    const user = await User.create({
        user_name: `user_${counter}`,
        email: `user${counter}_${Date.now()}@test.local`,
        first_name: 'Test',
        last_name: 'User',
        google_id: uniqueGoogleId(),
        ...overrides,
        password: hashed,
    });
    return { user, rawPassword: password };
};

const createAdmin = async (overrides = {}) => createUser({ user_role: 'admin', ...overrides });

const issueToken = (user) => jwt.sign(
    { id: user._id, user_name: user.user_name, user_role: user.user_role },
    process.env.JWT_TOKEN,
    { expiresIn: '1h' }
);

const createCategory = async (overrides = {}) => Category.create({
    name: `Category ${counter}`,
    slug: `category-${Date.now()}-${counter++}`,
    user_id: 'test-user-id',
    ...overrides,
});

const createProduct = async (overrides = {}) => {
    const category = overrides.category || [await createCategory()].map((c) => ({
        name: c.name,
        id: c._id.toString(),
        slug: c.slug,
    }));

    return Product.create({
        product_name: `Product ${counter++}`,
        description: 'A product used in tests.',
        user_id: 'test-user-id',
        stock: 10,
        price: '100',
        ...overrides,
        category,
    });
};

const guestId = () => crypto.randomBytes(16).toString('hex');

module.exports = {
    createUser,
    createAdmin,
    issueToken,
    createCategory,
    createProduct,
    guestId,
};
