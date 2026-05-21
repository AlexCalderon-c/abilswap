import { pool } from "../db/connect.ts"
import { type Request, type Response, type NextFunction } from "express"
import { type QueryResult } from "pg";
import { type CourseObject } from "../types/course.types.ts";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { course_name, description, price} = req.body;
        const course: QueryResult<CourseObject> = await pool.query(`INSERT INTO "course" (course_name, description, teacher_id, price) VALUES ($1, $2, $3, $4) RETURNING *`, [course_name, description, req.user?.id, price])
        const courseObject = course.rows[0];
        res.status(201).json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { course_id } = req.params;
        const course: QueryResult<CourseObject> = await pool.query("SELECT * FROM course WHERE id = $1", [course_id])
        const courseObject = course.rows[0];
        return res.status(200).json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const { course_name, description, price } = req.body;
        const course: QueryResult<CourseObject> = await pool.query("UPDATE course SET course_name = $1, description = $2, price = $3 WHERE id = $4 AND teacher_id = $5 RETURNING *", [course_name, description, price, id, req.user?.id])
        const courseObject = course.rows[0];
        res.json({
            message: "Course updated successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course: QueryResult<CourseObject> = await pool.query("DELETE FROM course WHERE id = $1 AND teacher_id = $2 RETURNING *", [id, req.user?.id])
        const courseObject = course.rows[0];
        res.json({
            message: "Course deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}