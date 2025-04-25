const { z } = require('zod');

// const questionIdSchema = z.object({
//   id: z.coerce.number().int().positive("Question ID must be a positive integer")
// });

const addResponseSchema = z.object({
  // questionId: z.number().int().positive("Question ID must be a positive integer"),
  response: z.string().min(1, "Response cannot be empty")
});

// const userResponsesSchema = z.object({
//   userId: z.coerce.number().int().positive("User ID must be a positive integer")
// });

module.exports = {
  // questionIdSchema,
  addResponseSchema,
  // userResponsesSchema
};