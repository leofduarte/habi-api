const { z } = require('zod');

const createMissionSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    emoji: z.string().optional(),
    status: z.string().optional(),
    // fk_id_goal: z.number().int().positive("Goal ID must be a positive integer"),
    days: z.array(z.number().int().positive()).optional()
});

const updateMissionSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    emoji: z.string().optional(),
    status: z.string().optional(),
    days: z.array(z.number().int().positive()).optional()
});

// const missionIdSchema = z.object({
//     id: z.number().int().positive("Mission ID must be a positive integer")
// });

// const toggleMissionCompletionSchema = z.object({
//     missionId: z.number().int().positive("Mission ID must be a positive integer"),
//     userId: z.number().int().positive("User ID must be a positive integer"),
//     completionDate: z.string().optional()
// });

module.exports = {
    createMissionSchema,
    updateMissionSchema,
    // missionIdSchema,
    // toggleMissionCompletionSchema
};