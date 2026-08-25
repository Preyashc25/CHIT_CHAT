import express from "express";
import {
  getSignUp,
  logIn,
  logOut,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const authRouter = express.Router();
// authRouter.use(arcjetProtection)

// authRouter.get('/test-user-1',(req,res)=>{
//   res.status(200).json({message:'Heyya'})
// })

authRouter.post("/signup", getSignUp);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);

authRouter.put("/update-profile", protectRoute, updateProfile);
authRouter.get("/check", protectRoute, (req, res) => {
  return res.status(200).json(req.user);
});

export default authRouter;
