import { Router } from "express";
import { createLesson, getLessonById, deleteLesson, updateLesson } from "../controllers/lesson.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { LessonSchema } from "../validators/lesson.validator.ts";

const route = Router()

route.post("/:module_id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(LessonSchema), createLesson);
route.get("/:id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getLessonById);
route.put("/:id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(LessonSchema), updateLesson);
route.delete("/:id", verifyAccessToken, roleMiddleware(["teacher"]), deleteLesson);

export default route;