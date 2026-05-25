import {z} from "zod"

export const LessonSchema = z.object({
    lesson_name: z.string(),
    content_type: z.enum(['video', 'text', 'quiz', 'pdf']),
    video_url: z.url()
})