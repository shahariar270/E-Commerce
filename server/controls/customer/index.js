const User = require("../../model/auth");
const ApiResponse = require("../../utils/api_response");

class customer_controller {
    async get_customers(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const match = {};
            if (search) {
                const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                match.$or = [
                    { user_name: regex },
                    { email: regex },
                    { first_name: regex },
                    { last_name: regex },
                ];
            }

            const total = await User.countDocuments(match);

            const customers = await User.aggregate([
                { $match: match },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) },
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'orders',
                    },
                },
                {
                    $addFields: {
                        order_count: { $size: '$orders' },
                        total_spent: { $sum: '$orders.totalAmount' },
                    },
                },
                {
                    $project: {
                        password: 0,
                        orders: 0,
                    },
                },
            ]);

            return ApiResponse.success(res, "Customers retrieved successfully", {
                data: customers,
                total,
            });
        } catch (error) {
            return ApiResponse.error(res, "Error retrieving customers", 500, error.message);
        }
    }

    async update_customer_status(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            if (typeof is_active !== 'boolean') {
                return ApiResponse.error(res, "is_active must be true or false", 400);
            }

            if (id === req.user.id) {
                return ApiResponse.error(res, "You cannot disable your own account", 400);
            }

            const customer = await User.findByIdAndUpdate(id, { is_active }, { new: true }).select('-password');
            if (!customer) {
                return ApiResponse.error(res, "Customer not found", 404);
            }

            return ApiResponse.success(res, `Account ${is_active ? 'enabled' : 'disabled'} successfully`, customer);
        } catch (error) {
            return ApiResponse.error(res, "Error updating account status", 500, error.message);
        }
    }
}

module.exports = new customer_controller;
