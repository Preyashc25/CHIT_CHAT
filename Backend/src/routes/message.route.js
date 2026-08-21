import express from "express";
import msgController from "../controllers/message.controller.js";

const msgRouter = express.Router();

msgRouter.get("/send", msgController.sendMessage);

export default msgRouter;
