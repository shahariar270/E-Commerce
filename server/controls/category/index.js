const Category = require('../../model/category/index');


class category_controller {
    async create_category(req, res) {
        try {
            const { name, slug, is_active } = req.body;
            const user_id = req.user.id;
            const new_category = Category.create({ name, slug, user_id, is_active });

            if (!name || !slug) {
                return res.status(400).json({
                    success: false,
                    message: "Name and slug are required"
                });
            }

            const existing = await Category.findOne({ slug });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Category already exists"
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: new_category,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error creating category',
                data: error.message
            });
        };
    }

    async get_categories(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const categories = await Category.find().skip(skip).limit(parseInt(limit));
            return res.status(200).json({
                success: true,
                message: 'Categories retrieved successfully',
                data: categories,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving categories',
                data: error.message
            });
        };
    }

    async update_category(req, res) {
        try {
            const { id } = req.params;
            const { name, slug, is_active } = req.body;
            const updated_category = await Category.find
                .findByIdAndUpdate(id, { name, slug, is_active }, { new: true });

            if (!updated_category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                data: updated_category,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error updating category',
                data: error.message
            });
        };
    }

    async delete_category(req, res) {
        try {
            const { id } = req.params;
            const deleted_category = await Category.findByIdAndDelete(id);
            if (!deleted_category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting category',
                data: error.message
            });
        };
    }

    async get_category_by_id(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Category retrieved successfully',
                data: category,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving category',
                data: error.message
            });
        };
    }
}

module.exports = new category_controller;