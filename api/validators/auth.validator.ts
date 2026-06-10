import {z} from "zod"

export const UserSchema = z.object({
    full_name: z.string().regex(/^[a-zA-Z0-9_\s]+$/, "This name is invaild. Don't use any special characters"),
    username: z.string().regex(/^[a-zA-Z0-9_]+$/, "This username is invalid. Don't use any special characters or whitespace"),
    email: z.email().min(2).max(255),
    password: z.string().min(6).max(32),
    bio: z.string().max(8000).optional(),
    profile_pic: z.url().optional()
})

export const LoginSchema = z.object({
    email: z.email().min(2).max(255),
    password: z.string().min(8).max(50)
})