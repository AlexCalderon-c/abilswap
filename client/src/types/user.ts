export interface User {
  id: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  name?: string
  avatar_url?: string
}
