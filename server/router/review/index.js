const express = require('express');
const auth_middleware = require('../../middlewares/auth_middleware');
const review = require('../../controls/review');
const router = express.Router();


router.post(
    '/review/:id', //here apply product id.
    auth_middleware.verify_token,
    review.create_rating,
);

router.get(
    '/review',
    review.get_all_reviews,
);

router.get(
    '/review/:id',// review id. 
    review.get_review_by_id,
);

router.put(
    '/review/:id',
    auth_middleware.verify_token,
    review.update_review,
);

router.delete(
    '/review/:id',
    auth_middleware.verify_token,
    review.delete_review,
);

module.exports = router;
