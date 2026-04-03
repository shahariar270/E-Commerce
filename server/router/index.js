const express = require('express');
const router = express.Router();
const auth_router = require('../router/auth/index');
const category_router = require('../router/category/index');
const product_router = require('../router/product/index');


router.use('/auth', auth_router);
router.use('/api', category_router);
router.use('/api', product_router);

module.exports = router;