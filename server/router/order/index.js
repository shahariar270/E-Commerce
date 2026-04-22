const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { create_order, admin_all_order, get_single_order } = require('../../controls/order');
const router = express.Router();


router.post('/order', auth_middleware.verify_token, create_order);
router.get('/admin/order', auth_middleware.verify_token, auth_middleware.verify_role('admin'), admin_all_order);
router.get('/order/:id', auth_middleware.verify_token, get_single_order);
router.put('/admin/order/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), update_order_status);
router.delete('/admin/order/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), delete_order);


module.exports = router;

