export interface Course {
  id: number
  course_name: string
  description: string
  created_at?: string
  teacher_id?: string
  price: number
  category?: string
  image_url?: string
  full_name?: string
  rating_avg?: number
  student_count?: number
}
