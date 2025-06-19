const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    timezone_offset: z.number().optional(),
    timezone_name: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const verifyEmailSchema = z.object({
    code: z.string()
        .length(4, "Verification code must be exactly 4 digits")
        .regex(/^\d+$/, "Verification code must contain only digits")
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyEmailSchema
};