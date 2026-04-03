const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { get_products, update_product, create_product, get_single_product } = require('../../controls/product');
const router = express.Router();

router.post(
    '/product',
    auth_middleware.verify_role('admin'),
    auth_middleware.verify_token,
    create_product
);

router.put(
    '/product:id',
    auth_middleware.verify_role('admin'),
    auth_middleware.verify_token,
    update_product
);

router.get(
    '/product:id',
    get_single_product
);

router.get(
    '/products',
    get_products
)

module.exports = router;