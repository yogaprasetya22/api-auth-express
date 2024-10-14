import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controller/user-controller";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

export { userRouter };
