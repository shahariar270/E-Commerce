const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../model/auth');
const {
    registerSchema,
    loginSchema,
    updateProfileSchema
} = require('../../validation_schema/auth');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');
const jwt_token = process.env.JWT_TOKEN;


module.exports = {
    register_controller: async (req, res) => {
        try {
            const validate = registerSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { user_name, email, password, first_name, last_name, user_role } = req.body;

            const existUser = await User.findOne({ email });
            if (existUser)
                return ApiResponse.error(res, "email already registered", 400);

            const hashedPass = await bcrypt.hash(password, 10);

            await User.create({
                user_name,
                email,
                password: hashedPass,
                first_name,
                last_name,
                user_role,
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
            const token = jwt.sign(
                { id: user._id, user_name: user.user_name, user_role: user.user_role },
                jwt_token,
                { expiresIn: "1h" }
            );

            return ApiResponse.success(res, "Login successfully", { token });

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    update_profile_controller: async (req, res) => {
        try {
            const { current_pass, new_pass, first_name, last_name, role, remove_image } = req.body;
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
    }
}