const express = require('express');
const router = express.Router();
const {
    register_controller,
    login_controller,
    update_profile_controller,
    profile_controller
} = require('../../controls/auth');
const auth_middleware = require('../../middlewares/auth_middleware');
require('dotenv').config();

router.post('/register', register_controller);

router.post('/login', login_controller);

router.post('/update_profile', auth_middleware.verify_token, update_profile_controller);

router.get('/profile', auth_middleware.verify_token, profile_controller);

module.exports = router;
