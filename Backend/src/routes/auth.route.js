import express from "express";
import { getSignUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/signup", getSignUp);

export default authRouter;
