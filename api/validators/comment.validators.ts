import {z} from "zod"

export const CommentSchema = z.object({
    content: z.string().max(8000)
})