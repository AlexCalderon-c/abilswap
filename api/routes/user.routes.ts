import { Router } from "express";
import { getProfile } from "../controllers/user.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";

const route = Router()
route.get("/me", verifyAccessToken, getProfile)

export default route;