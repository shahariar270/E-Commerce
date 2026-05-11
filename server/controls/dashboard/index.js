const Order = require("../../model/order");
const Product = require("../../model/product");
const User = require('../../model/auth');

class dashboard {
    async get_card_data(req, res) {
        try {
            const total_revenue = await Order.aggregate([
                {
                    $match: {
                        status: "delivered",
                        paymentStatus: "paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]);
            const revenue_count = total_revenue.length > 0 ? total_revenue[0].total : 0;

            const total_order = await Order.countDocuments();
            const total_product = await Product.countDocuments();

            const customer_count = await User.countDocuments({ role: "buyer" });

            return res.status(200).json({
                success: true,
                message: "Dashboard Loading successfully",
                data: {
                    revenue_count,
                    total_order,
                    total_product,
                    customer_count,
                },
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new dashboard