import express from "express";
import { deleteUser, getAllUsers, nameUpdate, replaceUser } from "../controllers/userController.js";
import { verifyAdmin, verifyUser, verifyToken } from "../middlewares/authMiddleware.js";
import { updateNameSchema,replaceUserSchema,deleteUserSchema } from "../validators/userValidators.js";
import { validate } from "../middlewares/validate.js";

const userRoutes = express.Router({ mergeParams: true });

// userRoutes.get("/",(req,res)=>{
//     res.send("Hello userRoutes Worked")
// })

userRoutes.get("/", verifyAdmin, getAllUsers);
userRoutes.patch("/:id", verifyUser,validate(updateNameSchema), nameUpdate);
userRoutes.put("/:id", verifyAdmin,validate(replaceUserSchema), replaceUser);
userRoutes.delete("/:id", verifyAdmin,validate(deleteUserSchema), deleteUser);

export default userRoutes;
