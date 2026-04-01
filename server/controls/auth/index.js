require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../model/auth');
const {
    registerSchema,
    loginSchema,
    updateProfileSchema
} = require('../../validation_schema/auth');
const jwt_token = process.env.JWT_TOKEN || 'default_secret_key';

module.exports = {
    register_controller: async (req, res) => {
        try {
            const validate = registerSchema.safeParse(req.body);
            if (!validate.success) {
                return res.status(400).json({
                    message: validate.error.issues[0].message,
                    success: false
                });
            }

            const { user_name, email, password, first_name, last_name, user_role } = req.body;

            const existUser = await User.findOne({ email });
            if (existUser)
                return res.status(400).json({ message: "email already registered", success: false });

            const hashedPass = await bcrypt.hash(password, 10);

            await User.create({
                user_name,
                email,
                password: hashedPass,
                first_name,
                last_name,
                user_role,
            });

            return res.status(201).json({ message: "User created successfully", success: true });
        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },
    login_controller: async (req, res) => {
        try {
            const validate = loginSchema.safeParse(req.body);
            if (!validate.success) {
                return res.status(400).json({ message: validate.error.errors[0].message, success: false });
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select("+password");

            if (!user) {
                return res.status(404).json({
                    message: "Your Request Email User Found",
                    success: false,
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);


            if (!isMatch) {
                return res.status(401).json({
                    message: "Password Wrong",
                });
            }
            const token = jwt.sign(
                { id: user._id, user_name: user.user_name, user_role: user.user_role },
                jwt_token,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                token,
                message: "Login successfully",
                success: true,
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    },
    update_profile_controller: async (req, res) => {
        try {
            const validate = updateProfileSchema.safeParse(req.body);
            if (!validate.success) {
                return res.status(400).json({ message: validate.error.errors[0].message, success: false });
            }

            const { current_pass, new_pass, first_name, last_name } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    success: false,
                });
            }

            if (current_pass && new_pass) {

                const match = await bcrypt.compare(current_pass, user.password);
                if (!match) {
                    return res.status(422).json({
                        message: "Current password is incorrect",
                        success: false,
                    });
                }

                const newPassHashed = await bcrypt.hash(new_pass, 10);
                user.password = newPassHashed;
            }

            if (first_name !== undefined) {
                user.first_name = first_name;
            }

            if (last_name !== undefined) {
                user.last_name = last_name;
            }

            await user.save();

            return res.status(200).json({
                message: "Profile updated successfully",
                success: true,
                data: {
                    _id: user._id,
                    user_name: user.user_name,
                    first_name: user.first_name,
                    last_name: user.last_name,
                }
            });

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
    },
    profile_controller: async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = await User.findOne({ _id: userId });

            res.status(200).json({
                message: 'User Get Successfully',
                data: userData,
                success: true
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false,
            })

        }
    }
}