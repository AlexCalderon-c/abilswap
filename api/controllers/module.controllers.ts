import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type ModuleObject } from "../types/module.types.ts";

export const createModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const {module_name} = req.body
        const response: QueryResult<ModuleObject> = await pool.query('INSERT INTO module (module_name, course_id) SELECT $1, $2 WHERE EXISTS (SELECT 1 FROM course WHERE course.id = $2 AND course.teacher_id = $3) RETURNING *', [module_name, course_id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(201).json(response.rows[0])
    }catch(error){
        next(error)
    }
}

export const getModuleById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const response: QueryResult<ModuleObject> = await pool.query('SELECT * FROM module WHERE id = $1', [module_id])
        
        res.status(200).json(response.rows[0])
    }catch(error){
        next(error)
    }
}

export const getModuleLessonInfoId = async (req: Request, res: Response, next: NextFunction) => { //SIN TESTS
    try{
        const {course_id} = req.params
        const response = await pool.query(`
            SELECT m.id, m.module_name, m.module_index, m.course_id,
            COALESCE(
                json_agg(
                json_build_object(
                    'id', l.id,
                    'lesson_name', l.lesson_name,
                    'lesson_index', l.lesson_index,
                    'content_type', l.content_type,
                    'video_url', l.video_url
                ) ORDER BY l.lesson_index
                ) FILTER (WHERE l.id IS NOT NULL),
                '[]'::json
            ) AS lessons
            FROM module m
            LEFT JOIN lesson l ON l.module_id = m.id
            WHERE m.course_id = $1
            GROUP BY m.id
            ORDER BY m.module_index`, [course_id]
        )
        res.status(200).json(response.rows)
    }catch(e){
        next(e)
    }
}

export const updateModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const {module_name} = req.body
        const response: QueryResult<ModuleObject> = await pool.query('UPDATE module SET module_name = $1 WHERE id = $2 AND EXISTS (SELECT 1 FROM course WHERE course.id = module.course_id AND course.teacher_id = $3)', [module_name, module_id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(204).end()
    }catch(e){
        next(e)
    }    
}

export const deleteModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const response: QueryResult<ModuleObject> = await pool.query('DELETE FROM module WHERE id = $1 AND EXISTS (SELECT 1 FROM course WHERE course.id = module.course_id AND course.teacher_id = $2)', [module_id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(204).json(response.rows[0])
    }catch(e){
        console.log(e)
        next(e)
    }    
}