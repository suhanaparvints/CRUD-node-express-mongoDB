import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.pattern.base": "Username can only contain letters and spaces (e.g., 'John Doe')",
    }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Invalid email format",
  }),

  address: Joi.string().min(5).optional().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
  }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S[\s\S]{4,}\S$/)
    .min(6)
    .max(128)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base":
        "Password must be 6 to 128 characters, with uppercase and lowercase letters, a number, and a special character",
    }),

  // role is OPTIONAL, but only accepts specific values when provided
  role: Joi.string().valid("admin", "user").optional(),

  age: Joi.number().integer().min(10).max(80).optional().messages({
    "number.base": "Age must be a number",
    "number.integer": "Age must be a whole number",
    "number.min": "Age must be at least 10",
    "number.max": "Age cannot exceed 80",
  }),
});
