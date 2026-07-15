import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import {pool} from '../db/connect.ts'
dotenv.config();

export const generateAccessToken = (payload: Object) => {
    const userToken = process.env.ACCESS_TOKEN_SECRET;
    if (!userToken) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, userToken, {
        expiresIn: "10s"
    });
}

export const generateRefreshToken = async (payload: Object, userId: string) => {
    const userToken = process.env.REFRESH_TOKEN_SECRET;
    if (!userToken) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    const tokenSigned = jwt.sign(payload, userToken, {
        expiresIn: "7d"
    })

    const currentDate = new Date()
    const dateNextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await pool.query('INSERT INTO refreshToken (token, createdat, expireat, user_Id) VALUES ($1, $2, $3, $4)', [tokenSigned, currentDate, dateNextWeek, userId])
    return tokenSigned
}

export const deleteRefreshToken = async (userId: string) => {
    await pool.query('DELETE FROM refreshToken WHERE user_id = $1', [userId])
}