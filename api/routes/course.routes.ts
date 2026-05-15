import { Router } from "express";
import { createCourse, getCourse, updateCourse, deleteCourse } from "../controllers/course.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";

const route = Router()

route.post("/", verifyAccessToken, createCourse);
route.get("/:id", verifyAccessToken, getCourse);
route.put("/:id", verifyAccessToken, updateCourse);
route.delete("/:id", verifyAccessToken, deleteCourse);

export default route;