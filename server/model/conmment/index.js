
const { default: mongoose, Schema } = require("mongoose");

const comment_schema = new mongoose.Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", require: true },
        content: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    },
    { timestamps: true }
);


const Comment = mongoose.model("Comment", comment_schema);

module.exports = Comment;
