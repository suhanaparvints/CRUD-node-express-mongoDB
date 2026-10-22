import Joi from "joi";
const id = Joi.string().hex().length(24).required();

export const updateNameSchema = {
  params: Joi.object({
    id,
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
  }),
};

export const replaceUserSchema = {
  params: Joi.object({
    id,
  }),
  body: Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot exceed 50 characters",
        "string.pattern.base": "Name can only contain letters and spaces",
        "any.required": "Name is required",
      }),
    age: Joi.number().integer().min(10).max(80).required().messages({
      "number.base": "Age must be a number",
      "number.integer": "Age must be a whole number",
      "number.min": "Age must be at least 10",
      "number.max": "Age cannot exceed 80",
      "any.required": "Age is required",
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    role: Joi.string().valid("admin", "user").required().messages({
      "any.only": "Role must be either admin or user",
      "any.required": "Role is required",
      "string.empty": "Role is required",
    }),
    address: Joi.string().trim().min(1).max(300).required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S[\s\S]{4,}\S$/)
      .max(128)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
        "string.max": "Password cannot exceed 128 characters",
        "string.pattern.base":
          "Password must be 6 to 128 characters, with uppercase and lowercase letters, a number, and a special character",
        "any.required": "Password is required",
      }),
  }),
};

export const deleteUserSchema = {
  params: Joi.object({
    id,
  }),
};
