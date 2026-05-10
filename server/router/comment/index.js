const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const { comment_create, update_comment, get_comments, delete_comment } = require('../../controls/comment');
const router = express.Router();

router.get(
    '/comments/:id',
    get_comments
);

router.post(
    '/comment/:id',
    auth_middleware.verify_token,
    comment_create
);

router.delete(
    '/comment/:id',
    auth_middleware.verify_token,
    delete_comment
)

router.put(
    '/comment/:id',
    auth_middleware.verify_token,
    update_comment
);


module.exports = router;
