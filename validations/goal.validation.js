const { z } = require('zod');

const createGoalSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
});

const updateGoalSchema = z.object({
    title: z.string().min(1, "Title is required").optional(), 
    description: z.string().optional(),
    isDone: z.boolean().optional()
});

// const goalIdSchema = z.object({
//     id: z.number().int().positive("Goal ID must be a positive integer") 
// });

module.exports = {
    createGoalSchema,
    updateGoalSchema,
    // goalIdSchema
};