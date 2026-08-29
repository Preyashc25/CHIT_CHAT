import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected:no token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected:Invalid Token");
      return next(new Error("Unauthorized:Invalid Token"));
    }

    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not Found");
      return next(new Error("User not Found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authentication for user: ${user.fullName} (${user._id})`,
    );
    next();
  } catch (error) {
    console.log("error while socket authentication: ", error);
    next(new Error("Unauthorized-Authentication failed"));
  }
};
