import Joi from "joi";

export const createTodoSchema = Joi.object({
  todoName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Todo name is required",
    "string.min": "Todo name must be at least 1 character",
    "string.max": "Todo name must be at most 100 characters",
    "any.required": "Todo name is required",
  }),
  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Description must be at most 500 characters",
  }),
  status: Joi.string()
    .valid("pending", "completed", "canceled")
    .default("pending"),
});

export const updateTodoSchema = Joi.object({
  todoName: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Todo name must be at least 1 character",
    "string.max": "Todo name must be at most 100 characters",
    "string.empty":"Todo name is required"
  }),
  description: Joi.string().trim().max(500).optional().messages({
    "string.max": "Description must be at most 500 characters",
  }),
  status: Joi.string()
    .valid("pending", "completed", "canceled")
    .optional()
    .messages({
      "any.only": "Status must be pending, completed, or canceled",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });
