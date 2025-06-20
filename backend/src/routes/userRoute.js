import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getUserProfile } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfile);

export default userRouter;
