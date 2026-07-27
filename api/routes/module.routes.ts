import { Router } from "express";
import { createModule, getModuleById, updateModule, deleteModule, getModuleLessonInfoId } from "../controllers/module.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { ModuleSchema } from "../validators/module.validator.ts";

const route = Router()


route.get("/moduleinfo/:course_id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getModuleLessonInfoId)
route.post("/:course_id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(ModuleSchema), createModule);
route.get("/:module_id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getModuleById);
route.put("/:module_id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(ModuleSchema), updateModule);
route.delete("/:module_id", verifyAccessToken, roleMiddleware(["teacher"]), deleteModule)

export default route;