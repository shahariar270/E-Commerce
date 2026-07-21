const express = require('express');
const router = express.Router();
const email_verification_controller = require('../../controls/emailVerification');
const auth_middleware = require('../../middlewares/auth_middleware');

router.post(
    '/email/send-code',
    auth_middleware.identify,
    email_verification_controller.send_code
);

router.post(
    '/email/verify-code',
    auth_middleware.identify,
    email_verification_controller.verify_code
);

module.exports = router;
