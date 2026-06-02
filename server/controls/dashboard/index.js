const Order = require("../../model/order");
const Product = require("../../model/product");
const User = require('../../model/auth');
const ApiResponse = require('../../utils/api_response');

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

            return ApiResponse.success(res, "Dashboard Loading successfully", {
                revenue_count,
                total_order,
                total_product,
                customer_count,
            });

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
    async total_data(req, res) {
        try {
            const topProducts = await Order.aggregate([
                { $unwind: "$items" },
                { $match: { paymentStatus: "paid" } },

                {
                    $group: {
                        _id: "$items.product",
                        totalSold: { $sum: "$items.quantity" },
                        name: { $first: "$items.name" },
                        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                        
                    }
                },

                { $sort: { totalSold: -1 } },
                { $limit: 10 }
            ]);
            return ApiResponse.success(res, "Top products retrieved successfully", { topProducts });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}

module.exports = new dashboard