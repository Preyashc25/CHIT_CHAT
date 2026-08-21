import express from "express";
import { getSignUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", getSignUp);
authRouter.get("/login", getLogIn);

export default authRouter;
