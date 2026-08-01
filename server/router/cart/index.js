const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { get_cart, create_cart, updated_cart, remove_item_from_cart } = require('../../controls/cart');
const router = express.Router();

router.get(
    '/cart',
    auth_middleware.identify,
    get_cart
);

router.post(
    '/cart',
    auth_middleware.identify,
    create_cart,
);

router.put(
    '/cart',
    auth_middleware.identify,
    updated_cart
);

router.delete(
    '/cart/:id',
    auth_middleware.identify,
    remove_item_from_cart,
);

module.exports = router;
