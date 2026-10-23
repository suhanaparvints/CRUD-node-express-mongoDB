import Joi from "joi";
import { nameValidation, passwordValidation } from "./userFieldValidators.js";

export const registerValidation = {
  body: Joi.object({
    name: nameValidation,

    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
    }),

    address: Joi.string().min(5).optional().messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters long",
    }),

    password: passwordValidation,

    role: Joi.string().valid("admin", "user").optional(),

    age: Joi.number().min(10).max(80).optional().messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 10",
      "number.max": "Age cannot exceed 80",
    }),
  }),
};