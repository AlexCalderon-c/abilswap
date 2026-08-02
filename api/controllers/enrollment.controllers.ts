import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type EnrollmentObject } from "../types/enrollment.types.ts";

export const createEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const {enrollment_status} = req.body
        const response: QueryResult<EnrollmentObject> = await pool.query('INSERT INTO enrollment (enrollment_status, student_id, course_id) VALUES ($1, $2, $3) RETURNING *', [enrollment_status, req.user?.id, course_id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(201).json(response.rows[0])
    }catch(error){
        next(error)
    } 
}

export const getEnrollmentById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<EnrollmentObject> = await pool.query('SELECT * FROM enrollment WHERE id = $1 AND student_id = $2', [id, req.user?.id])
        res.status(200).json(response.rows[0])
    }catch(error){
        next(error)
    }
}

export const updateEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const {enrollment_status} = req.body
        const response: QueryResult<EnrollmentObject> = await pool.query('UPDATE enrollment SET enrollment_status = $1 WHERE id = $2 AND student_id = $3', [enrollment_status, id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(201).json(response.rows[0])
    }catch(error){
        next(error)
    }
}

export const getEnrollmentByCourseId = async (req: Request, res: Response, next: NextFunction) => { //NO TESTS
    try{
        const {course_id} = req.params
        const response = await pool.query('SELECT * FROM enrollment WHERE course_id = $1 AND student_id = $2', [course_id, req.user?.id])
        if(response.rowCount === 0){
            throw new Error("Not enrolled to this course")
        }
        res.status(201).json({isEnrolled: true})
    }catch(e){
        next(e)
    }    
}

export const deleteEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<EnrollmentObject> = await pool.query('DELETE FROM enrollment WHERE id = $1 AND student_id = $2', [id, req.user?.id])
        if (response.rowCount === 0){
            throw new Error("Unauthorized")
        }
        res.status(204).json(response.rows[0])
    }catch(error){
        next(error)
    }
}
