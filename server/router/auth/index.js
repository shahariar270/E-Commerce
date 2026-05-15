const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    register_controller,
    login_controller,
    update_profile_controller,
    profile_controller
} = require('../../controls/auth');
const auth_middleware = require('../../middlewares/auth_middleware');
const { upload } = require('../../middlewares/file_handle');

router.post('/register', register_controller);

router.post('/login', login_controller);

router.post('/update_profile', auth_middleware.verify_token, upload.single('profile_image'), update_profile_controller);

router.get('/profile', auth_middleware.verify_token, profile_controller);

module.exports = router;
