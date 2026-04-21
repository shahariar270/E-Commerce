const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { create_order } = require('../../controls/order');
const router = express.Router();


router.post('/order', auth_middleware.verify_token, create_order);


module.exports = router;

