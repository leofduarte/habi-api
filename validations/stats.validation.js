const { z } = require('zod');

const getUserStatsSchema = z.object({
  userId: z.number().int().positive({
    message: "User ID must be a positive integer"
  })
});

const getWeeklyProgressSchema = z.object({
  userId: z.number().int().positive({
    message: "User ID must be a positive integer"
  }),
  startDate: z.string()
    .datetime({ message: "Start date must be a valid ISO datetime string" })
    .optional()
});

module.exports = {
  getUserStatsSchema,
  getWeeklyProgressSchema
};