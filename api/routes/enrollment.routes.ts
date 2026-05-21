import { Router } from "express";
import { createEnrollment, deleteEnrollment, getEnrollmentById, updateEnrollment} from "../controllers/enrollment.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";

const route = Router()

route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getEnrollmentById)
route.post('/:course_id', verifyAccessToken, roleMiddleware(['student']), createEnrollment)
route.put('/:id', verifyAccessToken, roleMiddleware(['student']), updateEnrollment)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student']), deleteEnrollment)

export default route