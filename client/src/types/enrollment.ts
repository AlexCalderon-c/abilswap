import type { Course } from './course'

export interface Enrollment {
  id: number
  enrollment_date: string
  enrollment_status: 'active' | 'completed' | 'dropped'
  student_id: string
  course_id: number
  course?: Course
}
