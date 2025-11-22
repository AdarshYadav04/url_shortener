import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";



import urlRouter from "./routes/urlRoute.js"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import chatRouter from "./routes/chatRoute.js"


// app config
const app=express()


//middleware
app.use(express.json())
app.use(helmet())
app.use(cors({ origin: 'https://shortly-z5i6.onrender.com', credentials: true }))
app.use(morgan('dev'))
app.use(cookieParser())


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);


app.use("/api/url",urlRouter)
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/bot",chatRouter)



app.get("/",(req,res)=>{
    res.send("API working")
})


export default app