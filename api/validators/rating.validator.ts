import {z} from "zod"

export const RatingSchema = z.object({
    rating_score: z.number().positive().min(0).max(5)
})