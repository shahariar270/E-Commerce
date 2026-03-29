const { z } = require('zod');

const registerSchema = z.object({
    user_name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const updateProfileSchema = z.object({
    current_pass: z.string().min(6),
    new_pass: z.string().min(6),
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100)
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema
};