const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { comment_create } = require('../../controls/comment');
const router = express.Router();

router.post(
    '/comment/:id',
     auth_middleware.verify_token,
     comment_create
);


module.exports = router;
