const express = require('express');
const router = express.Router();
const settings_controller = require('../../controls/settings');
const auth_middleware = require('../../middlewares/auth_middleware');

router.get(
    '/settings',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    settings_controller.get_settings
);

router.put(
    '/settings',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    settings_controller.update_settings
);

module.exports = router;
