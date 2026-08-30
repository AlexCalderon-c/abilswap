import {z} from "zod"

export const CourseSchema = z.object({
    course_name: z.string().min(6).max(150),
    description: z.string().max(3000),
    price: z.number().multipleOf(0.01).nonnegative(),
    category: z.string().min(1).max(150).optional(),
    image_url: z.url().min(1).optional()
})