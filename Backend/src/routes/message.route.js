import express from "express";
import { sendMessage } from "../controllers/message.controller.js";

const msgRouter = express.Router();

msgRouter.get("/send", sendMessage);

export default msgRouter;
