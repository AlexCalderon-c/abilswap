import { Router } from "express";
import { createCourse, getCourse, updateCourse, deleteCourse } from "../controllers/course.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";

const route = Router()

route.post("/", verifyAccessToken, roleMiddleware(["teacher"]), createCourse);
route.get("/:course_id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getCourse);
route.put("/:id", verifyAccessToken, roleMiddleware(["teacher"]), updateCourse);
route.delete("/:id", verifyAccessToken, roleMiddleware(["teacher"]), deleteCourse);

export default route;