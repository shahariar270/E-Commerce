const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/auth_middleware');
const category_controller = require('../../controls/category');

router.post('/category', verifyToken, category_controller.create_category);

router.get('/categories', verifyToken, category_controller.get_categories);

router.put('/category/:id', verifyToken, category_controller.update_category);

router.delete('/category/:id', verifyToken, category_controller.delete_category);


module.exports = router;