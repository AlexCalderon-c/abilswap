import { type Request, type Response, type NextFunction } from "express";
import { ZodType } from "zod";

export const validateMiddleware = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) return res.status(400).json(result.error.flatten())
        req.body = result.data
        next()
    }
}