import Joi from "joi";

export const nameValidation = Joi.string()
  .trim()
  .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
  .min(3)
  .max(50)
  .required()
  .messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.pattern.base": "Username can only contain letters and spaces (e.g., 'John Doe')",
  });

export const passwordValidation = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must include at least one uppercase, one lowercase, one number, one special character, and be at least 6 characters long",
  });