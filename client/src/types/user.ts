export interface User {
  id: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  username?: string
  profile_pic?: string
}
