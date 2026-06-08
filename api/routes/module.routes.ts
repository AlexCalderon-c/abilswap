import { Router } from "express";
import { createModule, getModuleById } from "../controllers/module.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { ModuleSchema } from "../validators/module.validator.ts";

const route = Router()

route.post("/:course_id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(ModuleSchema), createModule);
route.get("/:course_id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getModuleById);

export default route;