import type{ Lesson }from './lesson.ts'

export interface Module {
  id: number
  module_name: string
  lessons: Lesson[]
  module_index: number
  course_id: number
}
