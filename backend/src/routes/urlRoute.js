import express from "express"

import { shortenUrl ,redirectUrl,getDashboardData,deleteUrl} from "../controllers/urlController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const urlRouter=express.Router()


urlRouter.post('/shorten',authMiddleware,shortenUrl);
urlRouter.get('/dashboard', authMiddleware, getDashboardData)
urlRouter.get('/:shortId', redirectUrl)
urlRouter.delete('/:shortId', authMiddleware, deleteUrl);



export default urlRouter