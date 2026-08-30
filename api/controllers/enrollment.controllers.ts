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
        res.status(201).json(response.rowCount! > 0)
    }catch(e){
        next(e)
    }    
}



export const getEnrollmentDashboardById = async (req: Request, res: Response, next: NextFunction) => { //NO TEST
    try{
        const course = await pool.query(`
            SELECT
                e.id AS enrollment_id,
                e.enrollment_status,
                c.id AS course_id,
                c.course_name,
                c.description,
                c.image_url,
                c.category,
                COUNT(l.id) AS total_lessons,
                COUNT(lp.id) AS completed_lessons,
                ROUND(COUNT(lp.id) * 100.0 / NULLIF(COUNT(l.id), 0), 1) AS progress
            FROM enrollment e
            JOIN course c ON c.id = e.course_id
            JOIN module m ON m.course_id = c.id
            JOIN lesson l ON l.module_id = m.id
            LEFT JOIN lesson_progress lp
                ON lp.lesson_id = l.id AND lp.student_id = e.student_id
            WHERE e.student_id = $1
            GROUP BY e.id, c.id
            ORDER BY e.enrollment_date DESC
        `, [req.user?.id])
        res.status(201).json(course.rows)
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
