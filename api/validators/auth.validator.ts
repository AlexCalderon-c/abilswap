import {z} from "zod"

export const UserSchema = z.object({
    full_name: z.string().regex(/^[a-zA-Z0-9_]+$/, "Solo alfanumérico"),
    username: z.string().regex(/^[a-zA-Z0-9_]+$/, "Solo alfanumérico"),
    email: z.email().min(2).max(255),
    password: z.string().min(8).max(50),
    bio: z.string().max(8000).optional(),
    profile_pic: z.url().optional()
})

export const LoginSchema = z.object({
    email: z.email().min(2).max(255),
    password: z.string().min(8).max(50)
})