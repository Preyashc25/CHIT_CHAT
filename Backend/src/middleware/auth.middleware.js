import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

export const protectRoute = async (req,res,next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - no token provided",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized - no token provided",
      });
    }

    const user = await userModel.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute Middleware");
    res.status(400).json({ message: "Internal Server Error" });
  }
};

