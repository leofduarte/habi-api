const { z } = require('zod');

const prizeIdSchema = z.object({
    id: z.number().int().positive("Prize ID must be a positive integer"), 
});

const userIdSchema = z.object({
    userId: z.coerce.number().int().positive("User ID must be a positive integer"), 
});

const redeemPrizeSchema = z.object({
    isUsed: z.boolean("isUsed must be a boolean")
        .refine(value => value === true, {
            message: "Prize status can only be changed to 'used' (true) and cannot be reverted"
        }),
});

module.exports = {
    prizeIdSchema,
    userIdSchema,
    redeemPrizeSchema,
};