import type { Course } from './course'

export interface Enrollment {
  category: string
  course_id: number
  enrollment_id: number
  enrollment_status: "active" | "completed" | "dropped"
  image_url: string
  progress: number
  total_lessons: number
  completed_lessons: number
  description: string
  course_name: string
}
