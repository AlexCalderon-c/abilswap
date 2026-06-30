import { Router } from "express";
import { createRating, deleteRating, getRatingById, updateRating } from "../controllers/rating.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { RatingSchema } from "../validators/rating.validator.ts";

const route = Router()

route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getRatingById)
route.post('/:course_id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(RatingSchema), createRating)
route.put('/:id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(RatingSchema), updateRating)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student']), deleteRating)

export default route