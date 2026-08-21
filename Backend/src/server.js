import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import msgRouter from "./routes/message.route.js";

dotenv.config();

const app = express();

app.use("/api/auth", authRouter);
app.use("/api/message", msgRouter);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`The Server is running on http://localhost:${PORT}`),
);
