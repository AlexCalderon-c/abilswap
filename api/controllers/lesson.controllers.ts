import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";

export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const {lesson_name, content_type, video_url} = req.body
        const response = await pool.query('INSERT INTO lesson (lesson_name, module_id, content_type, video_url) VALUES ($1, $2, $3, $4)', [lesson_name, module_id, content_type, video_url])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const response = await pool.query('SELECT * FROM lesson WHERE id = $1', [module_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}