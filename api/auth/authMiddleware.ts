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
        if (userObject === null) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userObject.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            id: userObject.id,
            email: userObject.email,
            role: userObject.role
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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
        logger.info("Registration data:", req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(`INSERT INTO "user" (full_name, username, email, password, bio, profile_pic, role) VALUES ($1, $2, $3, $4, $5, $6, 'student') RETURNING *`, [full_name, username, email, hashedPassword, bio, profile_pic])
        const userObject = user.rows[0];
        res.status(201).json({
            message: "User registered successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const registerTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { full_name, username, email, password, bio, profile_pic, created_at, updated_at } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query("INSERT INTO user (full_name, username, email, password, bio, profile_pic, created_at, updated_at, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [full_name, username, email, hashedPassword, bio, profile_pic, created_at, updated_at, "teacher"])
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

