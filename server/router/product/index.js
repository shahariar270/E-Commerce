const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { get_products, update_product, create_product, get_single_product } = require('../../controls/product');
const router = express.Router();

router.post(
    '/product',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    create_product
);

router.put(
    '/product:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    update_product
);

router.get(
    '/products',
    get_products
)

router.get(
    '/product/:id',
    get_single_product
);

module.exports = router;