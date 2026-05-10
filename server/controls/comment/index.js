const Comment = require("../../model/conmment");


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

            return res.status(201).json({
                success: true,
                data: new_comment,
                message: "comment created successfully"
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    }
    async update_comment(req, res) {
        try {
            const { content, parent } = res.body
            const product_id = req?.params?.id
            const comment_id = req?.query?.comment_id;

            const comment = await Comment.findById(comment_id);

            if (!comment) {
                return res.status(200).json({
                    success: false,
                    message: "Comment is not Found",
                })
            }

            const updated_comment = await Comment.findByIdAndUpdate(comment_id, content, { new: true });

            return res.status(200).json({
                success: false,
                data: updated_comment,
                message: "Comment Updated Successfully"
            })

        } catch (error) {

        }
    }

    async delete_comment(req, res) {
        try {
            const comment_id = req.params.id;

            if (!comment_id) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not Found"
                });
            };

            const deleted_comment = await Comment.findByIdAndDelete(comment_id);

            await Comment.deleteMany({ parent: comment_id });

            return res.status(200).json({
                success: true,
                message: "Comment Deleted Successfully",
                data: deleted_comment,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })

        }
    }
}

module.exports = new comment_controls();