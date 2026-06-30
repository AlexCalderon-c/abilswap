import {z} from "zod"

export const EnrollmentSchema = z.object({
    enrollment_status: z.enum(['active', 'completed', 'dropped'])
})