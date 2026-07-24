
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
        },
        image_gallery: {
            type: [String],
            default: [],
            trim: true,
        },
        user_id: {
            type: String,
            required: true,
            minlength: 6,
        },
        // Real inventory count — in/low/out-of-stock status is derived from
        // this everywhere it's displayed, not stored separately, so there's
        // only ever one source of truth for availability.
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        category: {
            type: [{
                name: String,
                id: String,
                slug: String,
            }],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: "Please Select a Category"
            }
        },
        price: {
            type: String,
            default: ''
        },
        brand: {
            type: String,
            default: '',
            trim: true,
        },
        sku: {
            type: String,
            default: '',
            trim: true,
        },
        warranty: {
            type: String,
            default: '',
            trim: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", product_schema);

module.exports = Product;
