const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { comment_create, update_comment } = require('../../controls/comment');
const router = express.Router();

router.post(
    '/comment/:id',
    auth_middleware.verify_token,
    comment_create
);

router.delete(
    '/comment/:id',
    auth_middleware.verify_token,
    
)

router.put(
    '/comment/:id?comment_id',
    auth_middleware.verify_token,
    update_comment
);


module.exports = router;
