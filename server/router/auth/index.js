const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../model/auth');
const verifyToken = require('../../middlewares/auth_middleware');
require('dotenv').config();

const jwt_token = process.env.JWT_TOKEN

router.post('/register', async (req, res) => {
    try {
        const { user_name, email, password, first_name, last_name } = req.body;

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
        });

        return res.status(201).json({ message: "User created successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log(req);
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
            { id: user._id, user_name: user.user_name },
            jwt_token,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            token,
            message: "Login successfully",
            success: false,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
});

router.post('/update_profile', verifyToken, async (req, res) => {
    try {
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
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
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
});

module.exports = router;
