const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/auth_middleware');
const {
    register_controller,
    login_controller,
    update_profile_controller,
    profile_controller
} = require('../../controls/auth');
require('dotenv').config();

router.post('/register', register_controller);

router.post('/login', login_controller);

router.post('/update_profile', verifyToken, update_profile_controller);

router.get('/profile', verifyToken, profile_controller);

module.exports = router;
