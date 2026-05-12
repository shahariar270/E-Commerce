const Category = require('../../model/category/index');
const ApiResponse = require('../../utils/api_response');


class category_controller {
    async create_category(req, res) {
        try {
            const { name, slug, is_active } = req.body;
            const user_id = req.user.id;

            if (!name || !slug) {
                return ApiResponse.error(res, "Name and slug are required", 400);
            }
            const existing = await Category.find({ slug });

            if (existing.length > 0) {
                return ApiResponse.error(res, "Category already exists", 400);
            }
            const new_category = await Category.create({ name, slug, user_id, is_active });

            return ApiResponse.success(res, 'Category created successfully', new_category, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating category', 500, error.message);
        };
    }

    async get_categories(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const categories = await Category.find().skip(skip).limit(parseInt(limit));
            return ApiResponse.success(res, 'Categories retrieved successfully', categories);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving categories', 500, error.message);
        };
    }

    async update_category(req, res) {
        try {
            const { id } = req.params;
            const { name, slug, is_active } = req.body;
            const updated_category = await Category
                .findByIdAndUpdate(id, { name, slug, is_active }, { new: true });

            if (!updated_category) {
                return ApiResponse.error(res, 'Category not found', 404);
            }
            return ApiResponse.success(res, 'Category updated successfully', updated_category);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    async delete_category(req, res) {
        try {
            const { id } = req.params;
            const deleted_category = await Category.findByIdAndDelete(id);
            if (!deleted_category) {
                return ApiResponse.error(res, 'Category not found', 404);
            }
            return ApiResponse.success(res, 'Category deleted successfully', deleted_category);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error deleting category', 500, error.message);
        };
    }

    async get_category_by_id(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            if (!category) {
                return ApiResponse.error(res, 'Category not found', 404);
            }
            return ApiResponse.success(res, 'Category retrieved successfully', category);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error retrieving category', 500, error.message);
        };
    }
}

module.exports = new category_controller;