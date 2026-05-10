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
}

module.exports = new comment_controls();