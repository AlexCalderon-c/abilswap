import { Router } from "express";
import { getUsers, getProfile } from "../controllers/user.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";

const route = Router()
route.get("/", verifyAccessToken, getUsers)
route.get("/me", verifyAccessToken, getProfile)

export default route;