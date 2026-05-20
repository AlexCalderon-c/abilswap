import { Router } from "express";
import { createModule, getModuleById } from "../controllers/module.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";

const route = Router()

route.post("/:course_id", verifyAccessToken, roleMiddleware(["teacher"]), createModule);
route.get("/:id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getModuleById);

export default route;