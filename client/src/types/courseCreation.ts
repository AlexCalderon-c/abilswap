export interface CourseFormData {
  course_name: string
  description: string
  price: number
  category: string
  image_url: string
}

export interface ModuleFormData {
  id: string
  module_name: string
  lessons: LessonFormData[]
}

export interface LessonFormData {
  id: string
  lesson_name: string
  content_type: 'text' | 'video' | 'quiz' | 'article'
  video_url?: string
  content?: LessonContentFormData
}

export interface LessonContentFormData {
  tagline?: string
  intro?: string
  section: SectionFormData[]
  takeaways: string[]
}

export interface SectionFormData {
  id: string
  heading: string
  paragraph: string[]
  code?: string
  image?: string
  caption?: string
}

export type ContentType = 'text' | 'video' | 'quiz' | 'article'

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: 'text', label: 'Texto', icon: '📝' },
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'quiz', label: 'Quiz', icon: '❓' },
  { value: 'article', label: 'Artículo', icon: '📄' },
]

export function createEmptyModule(): ModuleFormData {
  return {
    id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    module_name: '',
    lessons: [],
  }
}

export function createEmptyLesson(contentType: ContentType = 'text'): LessonFormData {
  return {
    id: `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    lesson_name: '',
    content_type: contentType,
    video_url: '',
    content: contentType !== 'video' ? createEmptyContent() : undefined,
  }
}

export function createEmptyContent(): LessonContentFormData {
  return {
    tagline: '',
    intro: '',
    section: [createEmptySection()],
    takeaways: [''],
  }
}

export function createEmptySection(): SectionFormData {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    heading: '',
    paragraph: [''],
    code: '',
    image: '',
    caption: '',
  }
}