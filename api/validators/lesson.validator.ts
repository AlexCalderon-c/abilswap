import {z} from "zod"

const TextSchema = z.object({
    lesson_name: z.string(),
    content_type: z.literal("text"),
    content: z.string()
})

const VideoSchema = z.object({
    lesson_name: z.string(),
    content_type: z.literal("video"),
    video_url: z.url(),
    content: z.string().optional()
})

const PdfSchema = z.object({
    lesson_name: z.string(),
    content_type: z.literal("pdf"),
    content: z.string().optional()
})

const QuizSchema = z.object({
    lesson_name: z.string(),
    content_type: z.literal("quiz"),
    content: z.string().optional()
})

export const LessonSchema = z.discriminatedUnion('content_type', [TextSchema, VideoSchema, PdfSchema, QuizSchema])