const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    register_controller,
    login_controller,
    google_login_controller,
    update_profile_controller,
    profile_controller,
    forgot_password_controller,
    reset_password_controller
} = require('../../controls/auth');
const auth_middleware = require('../../middlewares/auth_middleware');
const { upload } = require('../../middlewares/file_handle');

router.post('/register', register_controller);

router.post('/login', login_controller);

router.post('/google', google_login_controller);

router.post('/update_profile', auth_middleware.verify_token, upload.single('profile_image'), update_profile_controller);

router.get('/profile', auth_middleware.verify_token, profile_controller);

router.post('/forgot-password', forgot_password_controller);

router.post('/reset-password', reset_password_controller);

module.exports = router;
