export interface EnrollmentObject{
    id: number,
    enrollment_date: string,
    enrollment_status: "active" | 'completed' | 'dropped',
    student_id: string,
    course_id: number
}