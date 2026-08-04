import { Router } from "express";
import { createCourse, getCourseByTeacher, updateCourse, deleteCourse, getCourseCompleteById, getEveryCourseByTeacher, getCourseComplete, getCategoriesFromCourses } from "../controllers/course.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { CourseSchema } from "../validators/course.validators.ts";

const route = Router()

route.get("/teacher/", verifyAccessToken, roleMiddleware(["teacher"]), getEveryCourseByTeacher)
route.get("/courseinfo/:course_id", verifyAccessToken, roleMiddleware(["teacher", "student"]), getCourseCompleteById)

route.get("/category/", verifyAccessToken, roleMiddleware(["teacher", "student"]), getCategoriesFromCourses)
route.post("/", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(CourseSchema), createCourse);
route.get("/:course_id", verifyAccessToken, roleMiddleware(["teacher"]), getCourseByTeacher);
route.get("/", verifyAccessToken, roleMiddleware(["teacher", "student"]), getCourseComplete)
route.put("/:id", verifyAccessToken, roleMiddleware(["teacher"]), validateMiddleware(CourseSchema), updateCourse);
route.delete("/:id", verifyAccessToken, roleMiddleware(["teacher"]), deleteCourse);

export default route;