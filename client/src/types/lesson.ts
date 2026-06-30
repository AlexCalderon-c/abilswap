export interface Lesson {
  id: number
  lesson_name: string
  module_id: number
  content_type: 'video' | 'text' | 'quiz' | 'pdf'
  video_url?: string
  lesson_index: number
}
