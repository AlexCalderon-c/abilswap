import { pool } from "../db/connect.ts"
import { type Request, type Response, type NextFunction } from "express"

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).json({
            Profile: req.user
        })
    }catch(error){
        next(error)
    }
}