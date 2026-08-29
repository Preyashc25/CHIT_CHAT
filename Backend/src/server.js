import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import authRouter from "./routes/auth.route.js";
import msgRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from 'cors'
import {app, server} from './lib/socket.js'

dotenv.config();


app.use(express.json({ limit: "10mb" }));
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", msgRouter);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
  connectDB();
});