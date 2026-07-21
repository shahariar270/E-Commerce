const Settings = require("../../model/settings");
const ApiResponse = require("../../utils/api_response");

class settings_controller {
    async get_settings(req, res) {
        try {
            const settings = await Settings.findOne();
            // No document yet — report schema defaults rather than 404ing,
            // since "unconfigured" and "configured with defaults" behave
            // identically for every caller of this endpoint.
            return ApiResponse.success(res, "Settings retrieved successfully", settings || new Settings());
        } catch (error) {
            return ApiResponse.error(res, "Error retrieving settings", 500, error.message);
        }
    }

    async update_settings(req, res) {
        try {
            const { require_guest_email_verification } = req.body;
            const update = {};
            if (typeof require_guest_email_verification === 'boolean') {
                update.require_guest_email_verification = require_guest_email_verification;
            }

            const settings = await Settings.findOneAndUpdate(
                {},
                update,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            return ApiResponse.success(res, "Settings updated successfully", settings);
        } catch (error) {
            return ApiResponse.error(res, "Error updating settings", 500, error.message);
        }
    }
}

module.exports = new settings_controller;
