import type { Course } from '../../../types'
import CourseCard from '../CourseCard/CourseCard'

interface Props {
  courses: Course[]
}

export default function CourseGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-tertiary flex items-center justify-center'>
          <svg className='w-8 h-8 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
        </div>
        <p className='text-lg font-medium text-text-primary mb-1'>No se encontraron cursos</p>
        <p className='text-sm text-text-muted'>Intenta ajustar los filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
