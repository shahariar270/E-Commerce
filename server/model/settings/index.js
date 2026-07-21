const { default: mongoose } = require("mongoose");

// Singleton document — there is only ever one settings record, fetched via
// Settings.findOne() (or created on first write). Add new site-wide toggles
// here as they're needed rather than one-off config files.
const settings_schema = new mongoose.Schema(
    {
        require_guest_email_verification: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Settings = mongoose.model("Settings", settings_schema);

module.exports = Settings;
