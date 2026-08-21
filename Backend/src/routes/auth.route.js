import express from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/signup", authController.getSignUp);

export default authRouter ;
