import { Router } from "express";
import { createCourse, getCourseByTeacher, updateCourse, deleteCourse, getCourseAll } from "../controllers/course.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { CourseSchema } from "../validators/course.validators.ts";

const route = Router()

route.post("/", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(CourseSchema), createCourse);
route.get("/:course_id", verifyAccessToken, roleMiddleware(["teacher"]), getCourseByTeacher);
route.get("/", verifyAccessToken, roleMiddleware(["teacher"]), getCourseAll)
route.put("/:id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(CourseSchema), updateCourse);
route.delete("/:id", verifyAccessToken, roleMiddleware(["teacher"]), deleteCourse);

export default route;