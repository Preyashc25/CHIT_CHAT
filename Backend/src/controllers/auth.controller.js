import userModel from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const getSignUp = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName | !email | !password) {
      return res.status(401).json({
        message: "All the fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        message: "Password must be 6 character long",
      });
    }
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegx.test(email)) {
      return res.status(401).json({
        message: "Invalid email Format",
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "Email already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPass,
    });
    if (newUser) {
      await newUser.save();
      const token = generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token: token,
      });
    } else {
      return res.status(401).json({
        message: "Invalid User data",
      });
    }
  } catch (error) {
    console.log("Error in Sign up", error);
    return res.status(500).json({
      message: "Internal server Error",
    });
  }
};

export const getLogIn = async (req, res, next) => {

};
