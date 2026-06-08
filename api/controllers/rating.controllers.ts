import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../db/connect.ts";
import { type QueryResult } from "pg";
import { type RatingObject } from "../types/rating.types.ts";

export const createRating = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {course_id} = req.params
        const {rating_score, comment} = req.body
        const response: QueryResult<RatingObject> = await pool.query('INSERT INTO rating (rating_score, comment, id_student, id_course) VALUES ($1, $2, $3, $4)', [rating_score, comment, req.user?.id, course_id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const getRatingById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<RatingObject> = await pool.query('SELECT * FROM rating WHERE id = $1', [id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const updateRating = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const {rating_score, comment} = req.body
        const response: QueryResult<RatingObject> = await pool.query('UPDATE rating SET rating_score = $1, comment = $2 WHERE id = $3 AND id_student = $4', [rating_score, comment, id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

export const deleteRating = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const response: QueryResult<RatingObject> = await pool.query('DELETE FROM rating WHERE id = $1 AND id_student = $2', [id, req.user?.id])
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}