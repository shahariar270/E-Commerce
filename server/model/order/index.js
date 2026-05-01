
const { default: mongoose, Schema } = require("mongoose");

const order_schema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true }
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Unpaid'], default: 'Unpaid' },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", order_schema);

module.exports = Order;
