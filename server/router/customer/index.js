const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const customer_controller = require('../../controls/customer');
const router = express.Router();

router.get(
    '/admin/customers',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    customer_controller.get_customers
);

router.put(
    '/admin/customers/:id/status',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    customer_controller.update_customer_status
);

module.exports = router;
