import { type Request, type Response, type NextFunction } from "express"


export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return res.status(403).json({ message: "Not authorized" });
        }
        next();
    }
}