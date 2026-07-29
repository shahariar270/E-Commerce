const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../../model/auth');
const {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    googleLoginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../../validation_schema/auth');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');
const socketManager = require('../../socket');
const sendMail = require('../../config/sender');

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const jwt_token = process.env.JWT_TOKEN;
if (!jwt_token) {
    throw new Error('FATAL: JWT_TOKEN environment variable is not set');
}

const google_client_id = process.env.GOOGLE_CLIENT_ID;
const googleClient = google_client_id ? new OAuth2Client(google_client_id) : null;

const issue_token = (user) => jwt.sign(
    { id: user._id, user_name: user.user_name, user_role: user.user_role },
    jwt_token,
    { expiresIn: "1h" }
);


module.exports = {
    register_controller: async (req, res) => {
        try {
            const validate = registerSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { user_name, email, password, first_name, last_name } = req.body;

            const existUser = await User.findOne({ email });
            if (existUser)
                return ApiResponse.error(res, "email already registered", 400);

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                user_name,
                email,
                password: hashedPass,
                first_name,
                last_name,
            });

            socketManager.emitToAdmins('new_user', {
                id: newUser._id,
                user_name: newUser.user_name,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                createdAt: newUser.createdAt,
            });

            return ApiResponse.success(res, "User created successfully", null, 201);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    login_controller: async (req, res) => {
        try {
            const validate = loginSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.errors[0].message, 400);
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select("+password");

            if (!user) {
                return ApiResponse.error(res, "Your Request Email User not Found", 404);
            }

            const isMatch = await bcrypt.compare(password, user.password);


            if (!isMatch) {
                return ApiResponse.error(res, "Password Wrong", 401);
            }

            if (user.is_active === false) {
                return ApiResponse.error(res, "This account has been disabled. Contact support for help.", 403);
            }

            const token = issue_token(user);

            return ApiResponse.success(res, "Login successfully", { token });

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    google_login_controller: async (req, res) => {
        try {
            if (!googleClient) {
                return ApiResponse.error(res, "Google login is not configured", 500);
            }

            const validate = googleLoginSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { credential } = req.body;

            let payload;
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: google_client_id,
                });
                payload = ticket.getPayload();
            } catch (err) {
                return ApiResponse.error(res, "Invalid Google credential", 401);
            }

            if (!payload?.email || !payload.email_verified) {
                return ApiResponse.error(res, "Google account has no verified email", 401);
            }

            const email = payload.email.toLowerCase();
            let user = await User.findOne({ email });

            if (user) {
                if (user.is_active === false) {
                    return ApiResponse.error(res, "This account has been disabled. Contact support for help.", 403);
                }
                if (!user.google_id) {
                    user.google_id = payload.sub;
                    await user.save();
                }
            } else {
                const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
                user = await User.create({
                    user_name: email.split('@')[0],
                    email,
                    password: randomPassword,
                    first_name: payload.given_name || payload.name || 'Google',
                    last_name: payload.family_name || '',
                    image: payload.picture || '',
                    google_id: payload.sub,
                });
            }

            const token = issue_token(user);

            return ApiResponse.success(res, "Login successfully", { token });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    update_profile_controller: async (req, res) => {
        try {
            const {
                current_pass, new_pass, first_name, last_name, role, remove_image,
                address_name, address_phone, address_line, address_city, address_postal_code,
            } = req.body;
            const userId = req.user.id;
            let updates = {}

            if (req.file) {
                const localPath = req.file.path;
                const imageUrl = await uploadImage(localPath);
                updates.image = imageUrl;
            } else if (remove_image === 'true') {
                updates.image = '';
            }
            const user = await User.findById(userId).select("+password");

            if (!user) {
                return ApiResponse.error(res, "User not found", 404);
            }

            if (current_pass && new_pass) {

                const match = await bcrypt.compare(current_pass, user.password);
                if (!match) {
                    return ApiResponse.error(res, "Current password is incorrect", 422);
                }

                updates.password = await bcrypt.hash(new_pass, 10);
            }

            if (first_name !== undefined) {
                updates.first_name = first_name;
            }

            if (last_name !== undefined) {
                updates.last_name = last_name;
            }

            if (address_name !== undefined) user.saved_address.name = address_name;
            if (address_phone !== undefined) user.saved_address.phone = address_phone;
            if (address_line !== undefined) user.saved_address.address = address_line;
            if (address_city !== undefined) user.saved_address.city = address_city;
            if (address_postal_code !== undefined) user.saved_address.postalCode = address_postal_code;

            Object.assign(user, updates);
            await user.save();

            return ApiResponse.success(res, "Profile updated successfully", user);

        } catch (error) {
            return ApiResponse.error(res, "Internal server error", 500, error.message);
        }
    },
    profile_controller: async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = await User.findById(userId);

            return ApiResponse.success(res, 'User Get Successfully', userData);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    forgot_password_controller: async (req, res) => {
        try {
            const validate = forgotPasswordSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { email } = req.body;
            // Always return the same response whether or not the email is
            // registered — confirming/denying an account's existence here is
            // the classic password-reset enumeration vector.
            const genericMessage = "If that email is registered, a password reset link has been sent";

            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                const rawToken = crypto.randomBytes(32).toString('hex');
                user.reset_password_token = hashToken(rawToken);
                user.reset_password_expires = Date.now() + RESET_TOKEN_TTL_MS;
                await user.save();

                const resetUrl = `${process.env.FRONTEND_URL || ''}/reset-password?token=${rawToken}`;
                await sendMail({
                    email: user.email,
                    subject: "Reset your password",
                    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="background-color:#111827;padding:40px;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:1px;">E-commerce</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin-top:0;color:#111827;font-size:24px;">Reset your password</h2>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                We received a request to reset the password for this account. Click the button
                below to choose a new one. This link expires in 30 minutes.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="background-color:#111827;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;display:inline-block;font-size:16px;font-weight:bold;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin-top:40px;color:#9ca3af;font-size:14px;text-align:center;">
                Didn't request this? You can safely ignore this email — your password won't change.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
                });
            }

            return ApiResponse.success(res, genericMessage);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    reset_password_controller: async (req, res) => {
        try {
            const validate = resetPasswordSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { token, password } = req.body;

            const user = await User.findOne({
                reset_password_token: hashToken(token),
                reset_password_expires: { $gt: Date.now() },
            });

            if (!user) {
                return ApiResponse.error(res, "Invalid or expired reset link", 400);
            }

            user.password = await bcrypt.hash(password, 10);
            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            await user.save();

            return ApiResponse.success(res, "Password reset successfully. You can now sign in.");
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}