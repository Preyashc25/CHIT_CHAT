import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import authRouter from "./routes/auth.route.js";
import msgRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({origin:3000,credentials:true}))
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", msgRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
  connectDB();
});