import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";

export const createModule = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const {module_name} = req.body
        const response = await pool.query('INSERT INTO module (module_name, course_id) VALUES ($1, $2)', [module_name, course_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const getModuleById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const response = await pool.query('SELECT * FROM module WHERE id = $1', [course_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}