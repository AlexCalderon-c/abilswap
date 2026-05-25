import {z} from "zod"

export const CourseSchema = z.object({
    course_name: z.string().min(6),
    description: z.string().max(8000),
    price: z.number().multipleOf(0.01)
})