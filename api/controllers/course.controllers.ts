import { pool } from "../db/connect.ts"
import { type Request, type Response, type NextFunction } from "express"
import { type QueryResult } from "pg";
import { type CourseObject } from "../types/course.types.ts";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { course_name, description, price} = req.body;
        const course: QueryResult<CourseObject> = await pool.query(`INSERT INTO "course" (course_name, description, teacher_id, price) VALUES ($1, $2, $3, $4) RETURNING *`, [course_name, description, req.user?.id, price])
        const courseObject = course.rows[0];
        res.status(201).json({
            ...courseObject,
            id: Number(courseObject?.id),
            price: Number(courseObject?.price)
        });
    } catch (error) {
        next(error);
    }
}

export const getCourseByTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { course_id } = req.params;
        const course: QueryResult<CourseObject> = await pool.query("SELECT * FROM course WHERE id = $1 AND teacher_id = $2", [course_id, req.user?.id])
        const courseObject = course.rows[0];
        return res.status(200).json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const getEveryCourseByTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course: QueryResult<CourseObject> = await pool.query("SELECT * FROM course WHERE teacher_id = $1", [req.user?.id])
        const courseObject = course.rows[0];
        return res.status(200).json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const getCourseAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course: QueryResult<CourseObject> = await pool.query("SELECT * FROM course")
        const courseObject = course.rows;
        return res.status(200).json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const getCourseComplete = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const course = await pool.query(`
            SELECT c.id, c.course_name, c.description, c.created_at, c.price, 
                c.category, c.image_url, u.full_name,
                COALESCE(ROUND(AVG(r.rating_score), 1), 0) AS rating_avg
            FROM course c
            INNER JOIN "user" u ON c.teacher_id = u.id
            LEFT JOIN rating r ON c.id = r.id_course
            GROUP BY c.id, u.full_name
            `)
        const courseObject = course.rows;
        return res.status(200).json(courseObject)
    }catch (error){
        next(error)
    }
}


export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const { course_name, description, price } = req.body;
        const course: QueryResult<CourseObject> = await pool.query("UPDATE course SET course_name = $1, description = $2, price = $3 WHERE id = $4 AND teacher_id = $5 RETURNING *", [course_name, description, price, id, req.user?.id])
        if (course.rowCount === 0){
            throw new Error("Unauthorized")
        }
        const courseObject = course.rows[0];
        return res.status(204).json(courseObject)
    } catch (error) {
        next(error);
    }
}

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course: QueryResult<CourseObject> = await pool.query("DELETE FROM course WHERE id = $1 AND teacher_id = $2 RETURNING *", [id, req.user?.id])
        const courseObject = course.rows[0];
        if (course.rowCount === 0){
            throw new Error("Unauthorized")
        }
        return res.status(204).json(courseObject)
    } catch (error) {
        next(error);
    }
}