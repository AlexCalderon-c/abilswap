import { pool } from "../db/connect.ts"
import { type Request, type Response, type NextFunction } from "express"


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await pool.query("SELECT * FROM \"user\"")
        res.json({
            data: response.rows,
            
        })
    } catch (error) {
        next(error);
    }
}