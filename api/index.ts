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
import { logger } from "./libs/logger.ts"
import userRoutes from "./routes/user.routes.ts"

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/user", userRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
   logger.info(`Server is running on http://localhost:${PORT}`)
})
