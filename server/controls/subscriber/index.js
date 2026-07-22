const Subscriber = require("../../model/subscriber");
const ApiResponse = require("../../utils/api_response");

class subscriber_controller {
    async subscribe(req, res) {
        try {
            const { email } = req.body;
            if (!email || typeof email !== 'string') {
                return ApiResponse.error(res, "Email is required", 400);
            }

            const normalized_email = email.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized_email)) {
                return ApiResponse.error(res, "Enter a valid email address", 400);
            }

            // Upsert rather than error on a repeat signup — the visitor
            // doesn't need to know whether they were already subscribed.
            await Subscriber.findOneAndUpdate(
                { email: normalized_email },
                { email: normalized_email, source: 'website' },
                { upsert: true, setDefaultsOnInsert: true }
            );

            return ApiResponse.success(res, "Subscribed successfully", null, 201);
        } catch (error) {
            return ApiResponse.error(res, "Error subscribing", 500, error.message);
        }
    }

    async get_subscribers(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const match = {};
            if (search) {
                const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                match.email = regex;
            }

            const total = await Subscriber.countDocuments(match);
            const subscribers = await Subscriber.find(match)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            return ApiResponse.success(res, "Subscribers retrieved successfully", {
                data: subscribers,
                total,
            });
        } catch (error) {
            return ApiResponse.error(res, "Error retrieving subscribers", 500, error.message);
        }
    }

    async delete_subscriber(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Subscriber.findByIdAndDelete(id);
            if (!deleted) {
                return ApiResponse.error(res, "Subscriber not found", 404);
            }
            return ApiResponse.success(res, "Subscriber removed successfully", deleted);
        } catch (error) {
            return ApiResponse.error(res, "Error removing subscriber", 500, error.message);
        }
    }
}

module.exports = new subscriber_controller;
