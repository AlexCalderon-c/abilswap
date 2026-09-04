import {literal, string, z} from "zod"

const SectionSchema = z.object({
    heading: z.string(),
    paragraph: z.array(z.string()),
    code: z.string().optional(),
    image: z.url().optional().or(z.literal('')),
    caption: z.string().optional()
})

const ContentSchema = z.object({
    tagline: z.string().optional(),
    intro: z.string().optional(),
    section: z.array(SectionSchema),
    takeaways: z.array(z.string())
})

const TextSchema = z.object({
    lesson_name: z.string().min(8).max(250),
    content_type: z.literal("text"),
    content: ContentSchema
})

const VideoSchema = z.object({
    lesson_name: z.string().min(8).max(250),
    content_type: z.literal("video"),
    video_url: z.url()
})

const PdfSchema = z.object({
    lesson_name: z.string().min(8).max(250),
    content_type: z.literal("pdf"),
    content: ContentSchema
})

const QuizSchema = z.object({
    lesson_name: z.string().min(8).max(250),
    content_type: z.literal("quiz"),
    content: ContentSchema
})

export const LessonSchema = z.discriminatedUnion('content_type', [TextSchema, VideoSchema, PdfSchema, QuizSchema])