import { Router } from "express";
import { createEnrollment, deleteEnrollment, getEnrollmentById, updateEnrollment, getEnrollmentByCourseId} from "../controllers/enrollment.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { EnrollmentSchema } from "../validators/enrollment.validator.ts";

const route = Router()

route.get('/courseinfo/:course_id', verifyAccessToken, roleMiddleware(['student']), getEnrollmentByCourseId)
route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getEnrollmentById)
route.post('/:course_id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(EnrollmentSchema), createEnrollment)
route.put('/:id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(EnrollmentSchema), updateEnrollment)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student']), deleteEnrollment)


export default route