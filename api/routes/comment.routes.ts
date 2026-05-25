import { Router } from "express";
import {createComment, deleteComment, getCommentById, updateComment} from "../controllers/comment.controllers.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { CommentSchema } from "../validators/comment.validators.ts";


const route = Router()

route.get('/:id', verifyAccessToken, roleMiddleware(['student', 'teacher']), getCommentById)
route.post('/:course_id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(CommentSchema), createComment)
route.put('/:id', verifyAccessToken, roleMiddleware(['student']), validateMiddleware(CommentSchema), updateComment)
route.delete('/:id', verifyAccessToken, roleMiddleware(['student']), deleteComment)

export default route