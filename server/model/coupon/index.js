const { default: mongoose } = require("mongoose");

const coupon_schema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discount_type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discount_value: {
            type: Number,
            required: true,
            min: 0,
        },
        max_discount_amount: {
            type: Number,
            default: null,
        },
        min_purchase_amount: {
            type: Number,
            default: 0,
        },
        usage_limit: {
            type: Number,
            default: null,
        },
        used_count: {
            type: Number,
            default: 0,
        },
        expiry_date: {
            type: Date,
            required: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        auto_apply: {
            type: Boolean,
            default: false,
        },
        user_id: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.model("Coupon", coupon_schema);

module.exports = Coupon;
