
const { default: mongoose } = require("mongoose");

const order_schema = new mongoose.Schema(
    {
        user_id: { type: ObjectId, ref: 'User', required: true },
        items: [
            {
                product: { type: ObjectId, ref: 'Product', required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        shippingAddress: {
            street: String,
            city: String,
            zipCode: String
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", order_schema);

module.exports = Order;
