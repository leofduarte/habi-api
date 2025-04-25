const { z } = require('zod');

// const userIdSchema = z.object({
//     id: z.number().int().positive("User ID must be a positive integer"),
// });

// const userEmailSchema = z.object({
//     email: z.string().email("Invalid email format"),
// });

const updateUserSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(), 
    firstName: z.string().optional(),
    lastName: z.string().optional(), 
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field to update is required",
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters long"), 
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

module.exports = {
    // userIdSchema,
    // userEmailSchema,
    updateUserSchema,
    changePasswordSchema,
};