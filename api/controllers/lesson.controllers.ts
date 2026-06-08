import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type LessonObject } from "../types/lesson.types.ts";

export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const {lesson_name, content_type, video_url, content} = req.body
        const response: QueryResult<LessonObject> = await pool.query('INSERT INTO lesson (lesson_name, module_id, content_type, video_url, content) VALUES ($1, $2, $3, $4, $5)', [lesson_name, module_id, content_type, video_url, content])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const response: QueryResult<LessonObject> = await pool.query('SELECT * FROM lesson WHERE id = $1', [module_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const {lesson_name, content_type, video_url, content} = req.body
        const response: QueryResult<LessonObject> = await pool.query('UPDATE lesson SET lesson_name = $1, content_type = $2, video_url = $3, content = $4 WHERE id = $5 AND user_id = $6', [lesson_name, content_type, video_url, content, id, req.user?.id ])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<LessonObject> = await pool.query('DELETE FROM lesson WHERE id = $1 AND user_id = $2', [id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}
