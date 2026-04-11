const { default: mongoose } = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: String,
    price: Number,
    image: String,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: Number
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema],

    total_quantity: {
        type: Number,
        default: 0
    },

    total_price: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


const Cart = mongoose.model("Cart", cartItemSchema);

module.exports = Cart;