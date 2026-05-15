/// <reference path="../types/express.d.ts" />
import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import { type UserObject } from "../types/user.types.ts"

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "Not Authenticated" });
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
        req.user = decodedToken as UserObject;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}