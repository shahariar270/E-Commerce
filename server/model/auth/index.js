
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            default: '',
            trim: true,
        },
        image: {
            type: String,
            default: '',
            trim: true,
        },
        google_id: {
            type: String,
            default: null,
            index: true,
            sparse: true,
            unique: true,
        },
        user_role: {
            type: String,
            default: 'buyer',
            enum: ['buyer', 'seller', 'admin'],
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        saved_address: {
            name: { type: String, default: '' },
            phone: { type: String, default: '' },
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            postalCode: { type: String, default: '' },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
