const { default: mongoose } = require("mongoose");

const email_verification_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        // Scoped to the guest session that requested it — a code sent for
        // one guest's checkout can't be used to verify another guest's.
        guest_id: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        expires_at: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

email_verification_schema.index({ guest_id: 1, email: 1 }, { unique: true });

const EmailVerification = mongoose.model("EmailVerification", email_verification_schema);

module.exports = EmailVerification;
