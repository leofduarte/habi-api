const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

module.exports = {
    registerSchema,
    loginSchema
};