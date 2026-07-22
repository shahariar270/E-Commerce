const express = require('express');
const router = express.Router();
const auth_router = require('../router/auth/index');
const category_router = require('../router/category/index');
const product_router = require('../router/product/index');
const cart_router = require('../router/cart/index');
const order_router = require('../router/order/index');
const coupon_router = require('../router/coupon/index');
const email_verification_router = require('../router/emailVerification/index');
const settings_router = require('../router/settings/index');
const dashboard = require('../router/dashboard/index');
const comment = require('../router/comment/index');
const review = require('../router/review/index');
const customer_router = require('../router/customer/index');
const subscriber_router = require('../router/subscriber/index');


router.use('/auth', auth_router);
router.use('/api', category_router);
router.use('/api', product_router);
router.use('/api', cart_router);
router.use('/api', order_router);
router.use('/api', coupon_router);
router.use('/api', email_verification_router);
router.use('/api', settings_router);
router.use('/api', dashboard);
router.use('/api', comment);
router.use('/api', review);
router.use('/api', customer_router);
router.use('/api', subscriber_router);

module.exports = router;
