import { Router } from "express";
import { getUsers } from "../controllers/user.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";

const route = Router()
route.get("/", verifyAccessToken, getUsers)

export default route;