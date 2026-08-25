import express from "express";
import { getAllContacts,getMessageByUserId,sendMessage,getChatPartner } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
// import { arcjetProtection } from "../middleware/arcjet.middleware.js";


const msgRouter = express.Router();

// msgRouter.use(arcjetProtection)
msgRouter.use(protectRoute)
msgRouter.get("/contacts", protectRoute, getAllContacts);
msgRouter.get('/chat',protectRoute,getChatPartner)
msgRouter.get('/:id',protectRoute,getMessageByUserId)
msgRouter.post('/send/:id',protectRoute,sendMessage)

export default msgRouter;
