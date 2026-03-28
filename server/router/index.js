const express = require('express');
const router = express.Router();
const auth_router = require('../router/auth/index');


router.use('/auth', auth_router);

module.exports = router;