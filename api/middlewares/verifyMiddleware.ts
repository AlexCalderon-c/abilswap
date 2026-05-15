/// <reference path="../types/express.d.ts" />
import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import { type UserObject } from "../types/user.types.ts"
import { generateAccessToken } from "../services/tokenServices.ts"

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


export const refreshTokenCookie = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {refreshToken} = req.cookies;
        if (!refreshToken) {
            throw new Error("No refresh token provided");
        }
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        const accessToken = generateAccessToken(user)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 1000
        })
        res.json({
            message: "Refresh token successful"
        })
    } catch (error) {
        next(error);
    }
}