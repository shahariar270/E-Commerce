const { default: mongoose } = require("mongoose");

const password_reset_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        // SHA-256 hash of the reset token — the raw token only ever lives in
        // the emailed link, so a DB read can't be turned into a working reset
        // link on its own.
        token_hash: {
            type: String,
            required: true,
        },
        expires_at: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

password_reset_schema.index({ email: 1 }, { unique: true });

const PasswordReset = mongoose.model("PasswordReset", password_reset_schema);

module.exports = PasswordReset;
