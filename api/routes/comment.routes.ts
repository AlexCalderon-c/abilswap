import { Router } from "express";
import {createComment, deleteComment, getCommentById, updateComment} from "../controllers/comment.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";

const route = Router()

route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getCommentById)
route.post('/:course_id', verifyAccessToken, roleMiddleware(['student']), createComment)
route.put('/:id', verifyAccessToken, roleMiddleware(['student']), updateComment)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student']), deleteComment)

export default route