const express = require('express');
const router = express.Router();
const category_controller = require('../../controls/category');
const auth_middleware = require('../../middlewares/auth_middleware');

router.post('/category', auth_middleware.verify_token, category_controller.create_category);

router.get('/categories', category_controller.get_categories);
router.get('/categories/:id', category_controller.get_category_by_id);

router.put('/category/:id', auth_middleware.verify_token, category_controller.update_category);

router.delete('/category/:id', auth_middleware.verify_token, category_controller.delete_category);


module.exports = router;