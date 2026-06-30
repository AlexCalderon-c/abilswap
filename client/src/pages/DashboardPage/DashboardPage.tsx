import type { Enrollment } from '../../types'
import EnrolledCourseCard from '../../components/dashboard/EnrolledCourseCard/EnrolledCourseCard'

const mockEnrollments: Enrollment[] = [
  { id: 1, enrollment_date: '2024-09-01', enrollment_status: 'active', student_id: '1', course_id: 1, course: { id: 1, course_name: 'Desarrollo Web Fullstack Completo', description: '', price: 49.99, teacher_name: 'Carlos Mendoza', category: 'Fullstack', created_at: '', teacher_id: '' } },
  { id: 2, enrollment_date: '2024-08-15', enrollment_status: 'completed', student_id: '1', course_id: 2, course: { id: 2, course_name: 'React & TypeScript Avanzado', description: '', price: 39.99, teacher_name: 'Ana García', category: 'Frontend', created_at: '', teacher_id: '' } },
  { id: 3, enrollment_date: '2024-10-10', enrollment_status: 'active', student_id: '1', course_id: 3, course: { id: 3, course_name: 'Node.js & APIs Escalables', description: '', price: 44.99, teacher_name: 'Miguel Torres', category: 'Backend', created_at: '', teacher_id: '' } },
]

export default function DashboardPage() {
  const active = mockEnrollments.filter((e) => e.enrollment_status === 'active')
  const completed = mockEnrollments.filter((e) => e.enrollment_status === 'completed')

  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>Mis cursos</h1>
            <p className='text-text-secondary'>Gestiona tu aprendizaje y da seguimiento a tu progreso</p>
          </div>
          <a href='/courses' className='hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all'>Explorar cursos</a>
        </div>

        {active.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-lg font-semibold text-text-primary mb-5 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-emerald-500' /> En progreso
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {active.map((e) => <EnrolledCourseCard key={e.id} enrollment={e} />)}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-lg font-semibold text-text-primary mb-5 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-blue-500' /> Completados
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {completed.map((e) => <EnrolledCourseCard key={e.id} enrollment={e} />)}
            </div>
          </section>
        )}

        {active.length === 0 && completed.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-lg font-medium text-text-primary'>No tienes cursos inscritos</p>
            <a href='/courses' className='mt-4 inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl'>Explorar cursos</a>
          </div>
        )}
      </div>
    </div>
  )
}
