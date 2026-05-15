const { default: mongoose } = require("mongoose");


const review_schema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);


const Review = mongoose.model("Review", review_schema);

module.exports = Review;
