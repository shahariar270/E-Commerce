
const { default: mongoose } = require("mongoose");

const product_schema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        user_id: {
            type: String,
            required: true,
            minlength: 6,
        },
        stock: {
            type: String,
            enum: ['in_stock', 'coming_soon', 'out_stock'],
            trim: true,
        },
        category_ids: {
            type: [String],
            default: [],
            validate: {
                validator: (v) => {
                    return v.every(st => st.length > 0);
                },
                message: "Please Select a Category"
            }
        },
        price: {
            type: String,
            default: ''
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", product_schema);

module.exports = Product;
