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
}

module.exports = new review_controls(); 
