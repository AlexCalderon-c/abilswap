import { pool } from "../db/connect.ts"
import { type Request, type Response, type NextFunction } from "express"

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, price } = req.body;
        const course = await pool.query("INSERT INTO course (title, description, price) VALUES ($1, $2, $3) RETURNING *", [title, description, price])
        const courseObject = course.rows[0];
        res.json({
            message: "Course created successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await pool.query("SELECT * FROM course WHERE id = $1", [id])
        const courseObject = course.rows[0];
        res.json(courseObject);
    } catch (error) {
        next(error);
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;
        const course = await pool.query("UPDATE course SET title = $1, description = $2, price = $3 WHERE id = $4 RETURNING *", [title, description, price, id])
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
        const course = await pool.query("DELETE FROM course WHERE id = $1 RETURNING *", [id])
        const courseObject = course.rows[0];
        res.json({
            message: "Course deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}