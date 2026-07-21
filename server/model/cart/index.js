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
    // Exactly one of user_id / guest_id identifies the cart's owner.
    // Both use a sparse unique index so a missing field never collides
    // with other carts that are also missing it.
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        unique: true,
        sparse: true
    },
    guest_id: {
        type: String,
        required: false,
        unique: true,
        sparse: true
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


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;