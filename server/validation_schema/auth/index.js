const { z } = require('zod');

const registerSchema = z.object({
    user_name: z.string({
        required_error: "user name is required field",
        invalid_type_error: "user name must be a string"
    }).min(2, "user name must be at least 2 characters"),

    email: z.string({
        required_error: "email is required field"
    }).email("invalid email"),

    password: z.string({
        required_error: "password is required field"
    }).min(6, "password must be at least 6 characters"),

    first_name: z.string({
        required_error: "first name is required field"
    }).min(2, "first name must be at least 2 characters"),

    last_name: z.string({
        required_error: "last name is required field"
    }).min(2, "last name must be at least 2 characters")
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const updateProfileSchema = z.object({
    current_pass: z.string().min(6).optional(),
    new_pass: z.string().min(6).optional(),
    first_name: z.string().min(2).max(100).optional(),
    last_name: z.string().min(2).max(100).optional()
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };