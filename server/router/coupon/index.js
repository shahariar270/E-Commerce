const express = require('express');
const router = express.Router();
const coupon_controller = require('../../controls/coupon');
const auth_middleware = require('../../middlewares/auth_middleware');

// NOTE: /coupon/apply routes must be registered before /coupon/:id so the
// literal "apply" segment isn't swallowed by the :id param on GET/PUT/DELETE.
router.post(
    '/coupon/apply',
    auth_middleware.identify,
    coupon_controller.apply_coupon
);

router.delete(
    '/coupon/apply',
    auth_middleware.identify,
    coupon_controller.remove_coupon
);

router.post(
    '/coupon',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    coupon_controller.create_coupon
);

router.get(
    '/coupons',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    coupon_controller.get_coupons
);

router.get(
    '/coupon/:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    coupon_controller.get_coupon_by_id
);

router.put(
    '/coupon/:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    coupon_controller.update_coupon
);

router.delete(
    '/coupon/:id',
    auth_middleware.verify_token,
    auth_middleware.verify_role('admin'),
    coupon_controller.delete_coupon
);

module.exports = router;
