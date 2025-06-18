const { z } = require('zod');

const addResponseSchema = z.object({
  questionId: z.number().int().positive("Question ID must be a positive integer"),
  response: z.string().min(1, "Response cannot be empty")
});

module.exports = {
  addResponseSchema,
};