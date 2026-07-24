// Dumps the current database into seed/data/*.json for reuse as seed data.
//
// PII is anonymized on the way out: real emails/names/phones/addresses are
// replaced with deterministic fake values, and password hashes / Google
// OAuth IDs are dropped entirely (import.js assigns every seeded user a
// fresh password — see SEED_PASSWORD there). EmailVerification is skipped
// on purpose: its records are live one-time codes, not reusable seed data.
//
// Usage: node seed/export.js

const path = require('path');
const fs = require('fs');

require(path.resolve(__dirname, '../server/config/env'));
const mongoose = require(path.resolve(__dirname, '../server/node_modules/mongoose'));

const User = require(path.resolve(__dirname, '../server/model/auth'));
const Product = require(path.resolve(__dirname, '../server/model/product'));
const Category = require(path.resolve(__dirname, '../server/model/category'));
const Cart = require(path.resolve(__dirname, '../server/model/cart'));
const Order = require(path.resolve(__dirname, '../server/model/order'));
const Coupon = require(path.resolve(__dirname, '../server/model/coupon'));
const Review = require(path.resolve(__dirname, '../server/model/review'));
const Comment = require(path.resolve(__dirname, '../server/model/conmment'));
const Settings = require(path.resolve(__dirname, '../server/model/settings'));
const Subscriber = require(path.resolve(__dirname, '../server/model/subscriber'));

const DATA_DIR = path.resolve(__dirname, 'data');

const fakeEmail = (prefix, n) => `${prefix}${n}@example.com`;
// "0" + "1" + a digit 3-9 + 8 digits = 11 digits, matching the app's BD phone regex.
const fakePhone = (n) => `017${String(n).padStart(8, '0')}`;

const writeJson = (filename, data) => {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${filename} (${data.length} record${data.length === 1 ? '' : 's'})`);
};

async function exportUsers() {
  const docs = await User.find({}).lean();
  const sanitized = docs.map((doc, i) => {
    const n = i + 1;
    return {
      ...doc,
      email: fakeEmail('user', n),
      user_name: `seed_user_${n}`,
      first_name: `First${n}`,
      last_name: `Last${n}`,
      image: '',
      google_id: undefined,
      password: undefined, // import.js assigns a fresh hash to every user
      saved_address: (doc.saved_address && doc.saved_address.address) ? {
        name: `Seed Address ${n}`,
        phone: fakePhone(n),
        address: `${n} Example Street`,
        city: 'Dhaka',
        postalCode: '1200',
      } : doc.saved_address,
    };
  });
  writeJson('users.json', sanitized);
}

async function exportOrders() {
  const docs = await Order.find({}).lean();
  const sanitized = docs.map((doc, i) => {
    const n = i + 1;
    return {
      ...doc,
      email: fakeEmail('order', n),
      shippingAddress: {
        name: `Seed Customer ${n}`,
        phone: fakePhone(n),
        address: `${n} Example Street`,
        city: 'Dhaka',
        postalCode: '1200',
      },
    };
  });
  writeJson('orders.json', sanitized);
}

async function exportSubscribers() {
  const docs = await Subscriber.find({}).lean();
  const sanitized = docs.map((doc, i) => ({
    ...doc,
    email: fakeEmail('subscriber', i + 1),
  }));
  writeJson('subscribers.json', sanitized);
}

async function exportPlain(Model, filename) {
  const docs = await Model.find({}).lean();
  writeJson(filename, docs);
}

// A batch of live products somehow ended up with stock set to the string
// "in_stock" instead of a number (see chat: the getStockStatus() bug this
// causes on the storefront). Coerce it here so seed data stays valid
// against the current schema instead of re-propagating the corruption.
async function exportProducts() {
  const docs = await Product.find({}).lean();
  const fixed = docs.map((doc) => {
    const stock = Number(doc.stock);
    return Number.isFinite(stock) ? doc : { ...doc, stock: 25 };
  });
  writeJson('products.json', fixed);
}

async function run() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  await mongoose.connect(process.env.DB_URL);

  await exportUsers();
  await exportPlain(Category, 'categories.json');
  await exportProducts();
  await exportPlain(Coupon, 'coupons.json');
  await exportPlain(Settings, 'settings.json');
  await exportPlain(Cart, 'carts.json');
  await exportOrders();
  await exportPlain(Review, 'reviews.json');
  await exportPlain(Comment, 'comments.json');
  await exportSubscribers();

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
