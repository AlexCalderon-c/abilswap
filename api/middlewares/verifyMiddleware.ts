/// <reference path="../types/express.d.ts" />
import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import { type UserObject } from "../types/user.types.ts"
import { generateAccessToken, generateRefreshToken, deleteRefreshToken } from "../services/tokenServices.ts"
import { type payloadType } from "../types/token.types.ts"
import { pool } from "../db/connect.ts"

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


export const refreshTokenCookie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {refreshToken} = req.cookies;
        console.log(refreshToken)
        if (!refreshToken) {
            throw new Error("No refresh token provided");
        }
        const verifyTokenDb = await pool.query('SELECT token FROM refreshToken WHERE token = $1', [refreshToken])
        console.log(verifyTokenDb.rows)
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as payloadType;

        if(verifyTokenDb.rowCount === 0){ //ERROR RELACIONADO CON ESTO, NO ESTA ENCONTRANDO REFRESHTOKEN EN LA BASE DE DATOS
            await deleteRefreshToken(user.id)
            throw new Error('Unauthorized')
        }

        const accessToken = generateAccessToken({id: user.id, username: user.username, role: user.role})
        await pool.query('DELETE FROM refreshToken WHERE token = $1', [refreshToken])
        const newRefreshToken = await generateRefreshToken({id: user.id, username: user.username, role: user.role}, user.id)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", newRefreshToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({
            message: "Refresh token successful"
        })
    } catch (error) {
        next(error);
    }
}