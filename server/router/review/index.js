const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const review = require('../../controls/review');
const router = express.Router();


router.post(
    '/review/:id', //here apply product id.
    auth_middleware.verify_token,
    review.create_rating(),
);