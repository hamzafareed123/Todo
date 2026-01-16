import Joi from "joi";

export const signupSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "string.empty": "Full Name is required",
    "any.required": "Full Name is required",
    "string.empty": "Email is required",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.email": "Email Should be valid",
      "any.required": "Email is required",
      "string.empty":"Emai is required"
    }),
  password: Joi.string().min(4).max(10).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most  10 characters",
    "any.required": "Password is required",
  }),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email should be valid",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(4).max(10).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most  10 characters",
    "any.required": "Password is required",
  }),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(1).trim().optional().messages({
    "string.min": "Full Name must be at least 1 character",
    "string.empty":"Full Name is required"
  }),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .optional()
    .messages({
      "string.email": "Email must be valid",
      "string.empty":"Email is required"
    }),
  profilePic: Joi.string().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email should be valid",
    "any.required": "Email is required",
    "string.empty":"Email is required"
  }),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(4).max(10).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most 10 characters",
    "any.required": "Password is required",
  }),
});
