import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getUserProfile} from "../controllers/userController.js";
import { updateUserPassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.put('/password', authMiddleware, updateUserPassword);
export default userRouter;
