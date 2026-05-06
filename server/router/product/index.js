const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const router = express.Router();
const { get_products, update_product, create_product, get_single_product, delete_product, upload_image } = require('../../controls/product');
const { upload } = require('../../middlewares/file_handle');

router.post(
    '/product',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    create_product
);

router.put(
    '/product/:id',
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

router.delete(
    '/product/:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    delete_product
);

router.post(
    '/products/:id/images',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    upload.array('products_gallery', 5),
    upload_image
);

module.exports = router;