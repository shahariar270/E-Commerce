const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const subscriber_controller = require('../../controls/subscriber');
const router = express.Router();

router.get(
    '/admin/subscribers',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    subscriber_controller.get_subscribers
);

router.delete(
    '/admin/subscribers/:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    subscriber_controller.delete_subscriber
);

module.exports = router;
