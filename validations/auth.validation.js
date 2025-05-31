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

module.exports = {
    registerSchema,
    loginSchema
};