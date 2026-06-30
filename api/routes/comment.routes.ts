import { Router } from "express";
import {createComment, deleteComment, getCommentById, getCommentByCourse, updateComment} from "../controllers/comment.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { CommentSchema } from "../validators/comment.validators.ts";


const route = Router()

route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getCommentById)
route.post('/:lesson_id', verifyAccessToken, roleMiddleware(['student', 'teacher']), validateMiddleware(CommentSchema), createComment)
route.put('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), validateMiddleware(CommentSchema), updateComment)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), deleteComment)

export default route