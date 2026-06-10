import bcrypt from "bcrypt"
import { pool } from "../db/connect.ts"
import { generateAccessToken, generateRefreshToken } from "../services/tokenServices.ts"
import { type Request, type Response, type NextFunction } from "express"
import { logger } from "../libs/logger.ts"

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password } = req.body;
        const user = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email])

        const userObject = user.rows[0];
        if (!userObject) {
            throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(password, userObject.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials")
        }

        const payload = {
            id: userObject.id,
            username: userObject.username,
            role: userObject.role
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            message: "Login successful"
        })

    } catch (error) {
        next(error);
    }
}

export const registerStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Registration request received");
        const { full_name, username, email, password, bio, profile_pic} = req.body;
        logger.info(req.body, "Registration data");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(`WITH userQuery AS (INSERT INTO "user" (full_name, username, email, password, bio, profile_pic, role) VALUES ($1, $2, $3, $4, $5, $6, 'student') RETURNING id) INSERT INTO student SELECT id FROM userQuery`, [full_name, username, email, hashedPassword, bio, profile_pic])
        const userObject = user.rows[0];
        res.status(201).json({
            message: "User registered successfully",
            result: userObject
        })
    } catch (error) {
        next(error);
    }
}

export const registerTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { full_name, username, email, password, bio, profile_pic } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(`WITH userQuery AS (INSERT INTO "user" (full_name, username, email, password, bio, profile_pic, role) VALUES ($1, $2, $3, $4, $5, $6, 'teacher') RETURNING id) INSERT INTO teacher SELECT id FROM userQuery`, [full_name, username, email, hashedPassword, bio, profile_pic])
        const userObject = user.rows[0];
        res.status(201).json({
            message: "User registered successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({
            message: "Logout successful"
        })
    } catch (error) {
        next(error);
    }
}

export const getCookies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(req.cookies);
    } catch (error) {
        next(error);
    }
}
