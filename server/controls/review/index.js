const Review = require('../../model/review');
const ApiResponse = require('../../utils/api_response');


class review_controls {
    async create_rating(req, res) {
        try {
            const { rating, title, comment } = req.body;
            const user_id = req.user.id;
            const { id: product_id } = req.params;

            if (!product_id) {
                return ApiResponse.error(res, "Product not founded", 404);
            };

            if (!user_id) {
                return ApiResponse.error(res, "User not founded", 404);
            };

            const new_review = await Review.create({
                author: user_id,
                product: product_id,
                comment,
                title,
                rating,
            });

            return ApiResponse.success(res, "Rating added Created successfully", new_review, 201);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async get_all_reviews(req, res) {
        try {
            const reviews = await Review.find()
                .populate("author", "name")
                .populate("product", "name");
            return ApiResponse.success(res, "Reviews fetched successfully", reviews, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async get_review_by_id(req, res) {
        try {
            const review = await Review.findById(req.params.id)
                .populate("author", "name")
                .populate("product", "name");
            if (!review) {
                return ApiResponse.error(res, "Review not found", 404);
            }
            return ApiResponse.success(res, "Review fetched successfully", review, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async update_review(req, res) {
        try {
            const { rating, title, comment } = req.body;
            const review = await Review.findByIdAndUpdate(
                req.params.id,
                { rating, title, comment },
                { new: true }
            );
            if (!review) {
                return ApiResponse.error(res, "Review not found", 404);
            }
            return ApiResponse.success(res, "Review updated successfully", review, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async delete_review(req, res) {
        try {
            const review = await Review.findByIdAndDelete(req.params.id);
            if (!review) {
                return ApiResponse.error(res, "Review not found", 404);
            }
            return ApiResponse.success(res, "Review deleted successfully", review, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}

module.exports = new review_controls(); 
