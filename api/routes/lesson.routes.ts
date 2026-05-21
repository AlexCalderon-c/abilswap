import { Router } from "express";
import { createLesson, getLessonById, deleteLesson, updateLesson } from "../controllers/lesson.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";

const route = Router()

route.post("/", verifyAccessToken, roleMiddleware(["teacher"]), createLesson);
route.get("/:id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getLessonById);
route.put("/:id", verifyAccessToken, roleMiddleware(["teacher"]), updateLesson);
route.delete("/:id", verifyAccessToken, roleMiddleware(["teacher"]), deleteLesson);

export default route;