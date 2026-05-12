const Comment = require("../../model/conmment");
const ApiResponse = require("../../utils/api_response");


class comment_controls {
    async comment_create(req, res) {
        try {
            const user_id = req?.user?.id;
            const product_id = req?.params?.id
            const { content, parent } = req.body;

            const new_comment = await Comment.create({
                product: product_id,
                author: user_id,
                content,
                parent,
            })

            return ApiResponse.success(res, "comment created successfully", new_comment, 201)

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
    async update_comment(req, res) {
        try {
            const { content } = req.body;
            const comment_id = req.params.id;

            const comment = await Comment.findById(comment_id);

            if (!comment) {
                return ApiResponse.error(res, "Comment not Found", 404);
            }

            // Check if the user is the author
            if (comment.author.toString() !== req.user.id) {
                return ApiResponse.error(res, "You are not authorized to update this comment", 403);
            }

            const updated_comment = await Comment.findByIdAndUpdate(
                comment_id,
                { content },
                { new: true }
            ).populate('author', 'user_name first_name last_name image');

            return ApiResponse.success(res, "Comment Updated Successfully", updated_comment);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async get_comments(req, res) {
        try {
            const product_id = req.params.id;
            const comments = await Comment.find({ product: product_id })
                .populate('author', 'user_name first_name last_name image')
                .sort({ createdAt: 1 }); // Sort by oldest first to maintain thread flow

            // Create a map to store comments by their ID for quick lookup
            const commentMap = {};
            comments.forEach(comment => {
                commentMap[comment._id] = { ...comment._doc, children: [] };
            });

            const nestedComments = [];
            comments.forEach(comment => {
                if (comment.parent) {
                    if (commentMap[comment.parent]) {
                        commentMap[comment.parent].children.push(commentMap[comment._id]);
                    }
                } else {
                    nestedComments.push(commentMap[comment._id]);
                }
            });

            // For the frontend, it might be easier if we sort the final list to show newest threads first
            nestedComments.reverse();

            return ApiResponse.success(res, "Comments fetched successfully", nestedComments);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async delete_comment(req, res) {
        try {
            const comment_id = req.params.id;

            if (!comment_id) {
                return ApiResponse.error(res, "Comment not Found", 404);
            };

            const comment = await Comment.findById(comment_id);
            if (!comment) {
                return ApiResponse.error(res, "Comment not Found", 404);
            }

            // Check if the user is the author or an admin
            if (comment.author.toString() !== req.user.id && req.user.user_role !== 'admin') {
                return ApiResponse.error(res, "You are not authorized to delete this comment", 403);
            }

            const deleted_comment = await Comment.findByIdAndDelete(comment_id);

            await Comment.deleteMany({ parent: comment_id });

            return ApiResponse.success(res, "Comment Deleted Successfully", deleted_comment);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);

        }
    }
}

module.exports = new comment_controls();