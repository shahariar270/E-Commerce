const express = require('express');
const router = express.Router();
const auth_middleware = require('../../middlewares/auth_middleware');
const dashboard = require('../../controls/dashboard');

router.get(
    '/dashboard/cards',
    // auth_middleware.verify_token,
    // auth_middleware.verify_role('admin'),
    dashboard.get_card_data
)

module.exports = router;
