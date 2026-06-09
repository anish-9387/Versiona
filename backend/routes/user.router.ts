import { Router } from "express";
import * as userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/:id", userController.getUserProfile);
userRouter.put("/:id", userController.updateUserProfile);
userRouter.delete("/:id", userController.deleteUserProfile);

export default userRouter;
