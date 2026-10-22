import express from "express";

import { adminLogin, registerUser, userLogin } from "../controllers/authController.js";
import { getAllUsers } from "../controllers/userController.js";
import { registerValidation } from "../validators/authValidators.js";
import { validate } from "../middlewares/validate.js";

const authRoutes = express.Router({ mergeParams: true });

// authRoutes.get("/login",(req,res)=>{
//     res.status(200).json({
//         status:"OK",
//         message:"Success authRoute Page "
//     })
// })

// authRoutes.post("/login",adminLogin)
authRoutes.post("/register", validate(registerValidation), registerUser);
authRoutes.post("/login", userLogin);

export default authRoutes;
