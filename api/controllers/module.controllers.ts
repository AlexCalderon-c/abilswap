import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type ModuleObject } from "../types/module.types.ts";

export const createModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const {module_name} = req.body
        const response: QueryResult<ModuleObject> = await pool.query('INSERT INTO module (module_name, course_id) SELECT $1, $2 WHERE EXISTS (SELECT 1 FROM course WHERE course.id = $2 AND course.teacher_id = $3)', [module_name, course_id, req.user?.id])
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
        const {course_id} = req.params
        const response: QueryResult<ModuleObject> = await pool.query('SELECT * FROM module WHERE id = $1', [course_id])
        
        res.status(200).json(response.rows[0])
    }catch(error){
        next(error)
    }
}

export const updateModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const {module_name} = req.body
        const response: QueryResult<ModuleObject> = await pool.query('UPDATE module SET module_name = $1 WHERE module_id = $2 AND EXISTS (SELECT 1 FROM course WHERE course.id = module.course_id AND course.teacher_id = $3)', [module_name, module_id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(201).json(response.rows[0])
    }catch(e){
        next(e)
    }    
}

export const deleteModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {module_id} = req.params
        const response: QueryResult<ModuleObject> = await pool.query('DELETE FROM module WHERE module_id = $1 AND EXISTS (SELECT 1 FROM course WHERE course.id = module.course_id AND course.teacher_id = $2)', [module_id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(204).json(response.rows[0])
    }catch(e){
        next(e)
    }    
}