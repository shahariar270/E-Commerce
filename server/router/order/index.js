const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { create_order, admin_all_order } = require('../../controls/order');
const router = express.Router();


router.post('/order', auth_middleware.verify_token, create_order);
router.get('/admin/order', auth_middleware.verify_token, auth_middleware.verify_role('admin'), admin_all_order);


module.exports = router;

