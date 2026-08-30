export interface Lesson {
  id: number
  lesson_name: string
  module_id: number
  content_type: 'video' | 'text' | 'quiz' | 'pdf'
  video_url?: string
  lesson_index: number
  content?: LessonContent
  duration?: string
}

interface SectionInterface{
  heading: string,
  paragraph: string[]
  code?: string,
  image?: string
  caption?: string
}

export interface LessonContent{
  tagline?: string,
  intro?: string,
  section: SectionInterface[]
  takeaways: string[]
}