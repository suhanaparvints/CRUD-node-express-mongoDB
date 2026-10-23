import express from "express";

import { validate } from "../middlewares/validate.js";
import { registerValidation } from "../validators/authValidators.js";
import { registerUser } from "../controllers/authController.js";

const authRoutes = express.Router({ mergeParams: true });

authRoutes.post("/register", validate(registerValidation), registerUser);

export default authRoutes;