import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config();

export const generateAccessToken = (payload: Object) => {
    const userToken = process.env.ACCESS_TOKEN_SECRET;
    if (!userToken) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, userToken, {
        expiresIn: "15m"
    });
}

export const generateRefreshToken = (payload: Object) => {
    const userToken = process.env.REFRESH_TOKEN_SECRET;
    if (!userToken) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, userToken, {
        expiresIn: "7d"
    });
}