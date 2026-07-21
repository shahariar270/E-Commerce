const EmailVerification = require("../../model/emailVerification");
const ApiResponse = require("../../utils/api_response");
const sendMail = require("../../config/sender");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

class email_verification_controller {
    async send_code(req, res) {
        try {
            const { guest_id, id: user_id } = req.user;
            const { email } = req.body;

            if (user_id) {
                return ApiResponse.error(res, "Email verification is only needed for guest checkout", 400);
            }
            if (!email || !EMAIL_REGEX.test(email)) {
                return ApiResponse.error(res, "A valid email address is required", 400);
            }

            const normalized_email = email.trim().toLowerCase();
            const existing = await EmailVerification.findOne({ guest_id, email: normalized_email });

            if (existing && Date.now() - existing.updatedAt.getTime() < RESEND_COOLDOWN_MS) {
                const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.updatedAt.getTime())) / 1000);
                return ApiResponse.error(res, `Please wait ${waitSeconds}s before requesting another code`, 429);
            }

            const code = generateCode();
            const expires_at = new Date(Date.now() + CODE_TTL_MS);

            await EmailVerification.findOneAndUpdate(
                { guest_id, email: normalized_email },
                { code, verified: false, attempts: 0, expires_at },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await sendMail({
                email: normalized_email,
                subject: "Your verification code",
                html: `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="background-color:#111827;padding:32px;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">E-commerce</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;text-align:center;">
              <h2 style="margin-top:0;color:#111827;font-size:20px;">Verify your email</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;">Enter this code to confirm your email and continue checkout:</p>
              <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#111827;margin:24px 0;">${code}</p>
              <p style="color:#9ca3af;font-size:13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
            });

            return ApiResponse.success(res, "Verification code sent to your email");
        } catch (error) {
            return ApiResponse.error(res, "Error sending verification code", 500, error.message);
        }
    }

    async verify_code(req, res) {
        try {
            const { guest_id, id: user_id } = req.user;
            const { email, code } = req.body;

            if (user_id) {
                return ApiResponse.error(res, "Email verification is only needed for guest checkout", 400);
            }
            if (!email || !code) {
                return ApiResponse.error(res, "Email and code are required", 400);
            }

            const normalized_email = email.trim().toLowerCase();
            const record = await EmailVerification.findOne({ guest_id, email: normalized_email });

            if (!record) {
                return ApiResponse.error(res, "No verification code found for this email. Please request a new one.", 404);
            }
            if (record.verified) {
                return ApiResponse.success(res, "Email already verified", { verified: true });
            }
            if (record.expires_at < new Date()) {
                return ApiResponse.error(res, "This code has expired. Please request a new one.", 400);
            }
            if (record.attempts >= MAX_ATTEMPTS) {
                return ApiResponse.error(res, "Too many incorrect attempts. Please request a new code.", 429);
            }
            if (record.code !== String(code).trim()) {
                record.attempts += 1;
                await record.save();
                return ApiResponse.error(res, "Incorrect code", 400);
            }

            record.verified = true;
            await record.save();

            return ApiResponse.success(res, "Email verified successfully", { verified: true });
        } catch (error) {
            return ApiResponse.error(res, "Error verifying code", 500, error.message);
        }
    }
}

module.exports = new email_verification_controller;
