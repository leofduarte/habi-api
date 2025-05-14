const { z } = require('zod');

const addResponseSchema = z.object({
  response: z.string().min(1, "Response cannot be empty")
});

module.exports = {
  addResponseSchema,
};