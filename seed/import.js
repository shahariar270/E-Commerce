// Loads seed/data/*.json into whatever database DB_URL points at.
// Upserts by _id, so it's safe to re-run and won't duplicate records.
//
// Every seeded user gets the same fresh password (see SEED_PASSWORD below)
// — the real hashes were never exported, so this is the only way to log
// into a seeded account.
//
// Usage: node seed/import.js

const path = require('path');
const fs = require('fs');

require(path.resolve(__dirname, '../server/config/env'));
const mongoose = require(path.resolve(__dirname, '../server/node_modules/mongoose'));
const bcrypt = require(path.resolve(__dirname, '../server/node_modules/bcrypt'));

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
const SEED_PASSWORD = 'Password123!';

const readJson = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

async function upsertAll(Model, docs, label) {
  let count = 0;
  for (const doc of docs) {
    const { _id, ...rest } = doc;
    await Model.updateOne({ _id }, { $set: rest }, { upsert: true });
    count += 1;
  }
  console.log(`${label}: ${count} record${count === 1 ? '' : 's'}`);
}

async function seedUsers() {
  const docs = readJson('users.json');
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const withPassword = docs.map((doc) => ({ ...doc, password: passwordHash }));
  await upsertAll(User, withPassword, 'Users');
}

async function run() {
  await mongoose.connect(process.env.DB_URL);

  await seedUsers();
  await upsertAll(Category, readJson('categories.json'), 'Categories');
  await upsertAll(Product, readJson('products.json'), 'Products');
  await upsertAll(Coupon, readJson('coupons.json'), 'Coupons');
  await upsertAll(Settings, readJson('settings.json'), 'Settings');
  await upsertAll(Cart, readJson('carts.json'), 'Carts');
  await upsertAll(Order, readJson('orders.json'), 'Orders');
  await upsertAll(Review, readJson('reviews.json'), 'Reviews');
  await upsertAll(Comment, readJson('comments.json'), 'Comments');
  await upsertAll(Subscriber, readJson('subscribers.json'), 'Subscribers');

  await mongoose.disconnect();
  console.log(`\nDone. All seeded users share the password: ${SEED_PASSWORD}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
