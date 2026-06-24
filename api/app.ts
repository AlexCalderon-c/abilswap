import express from "express"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { errorHandler } from "./middlewares/errorMiddleware.ts"
import authRoutes from "./routes/auth.routes.ts"
import courseRoutes from "./routes/course.routes.ts"
import cookieParser from "cookie-parser"
import helmet from "helmet"

import userRoutes from "./routes/user.routes.ts"
import moduleRoutes from './routes/module.routes.ts'
import lessonRoutes from './routes/lesson.routes.ts'
import ratingRoutes from './routes/rating.routes.ts'
import enrollmentRoutes from './routes/enrollment.routes.ts'
import commentRoutes from './routes/comment.routes.ts'
import { globalLimiter } from "./libs/rateLimiters.ts"


const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }))
app.use(morgan("dev"))
app.use(express.json({limit: "1mb"}))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(helmet())
app.use(cookieParser())
app.use(globalLimiter)

app.use("/api/auth", authRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/user", userRoutes)
app.use("/api/module", moduleRoutes)
app.use("/api/lesson", lessonRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/enrollment", enrollmentRoutes)
app.use("/api/comment", commentRoutes)

app.use(errorHandler)

export default app