import express from "express";
import userController from "../controller/user-controller";
import authController from "../controller/auth-controller";

const publicRouter = express.Router();
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.get("/auth/google", authController.authGoogle);
publicRouter.get("/auth/google/callback", authController.authGoogleCallback);
publicRouter.get("/", userController.ping);

export { publicRouter };
