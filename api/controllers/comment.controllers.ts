import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type CommentObject } from "../types/comment.types.ts";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {lesson_id} = req.params
        const {content} = req.body
        const response: QueryResult<CommentObject> = await pool.query('INSERT INTO comment (content, user_id, lesson_id) VALUES ($1, $2, $3)', [content, req.user?.id, lesson_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<CommentObject> = await pool.query('SELECT * FROM comment WHERE id = $1 AND student_id = $2', [id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const {content} = req.body
        const response: QueryResult<CommentObject> = await pool.query('UPDATE comment SET content = $1 WHERE id = $2 AND student_id = $3', [content, id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<CommentObject> = await pool.query('DELETE FROM comment WHERE id = $1 AND student_id = $2', [id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}
