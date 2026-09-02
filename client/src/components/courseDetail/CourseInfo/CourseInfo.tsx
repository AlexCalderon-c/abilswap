import type { Course } from '../../../types'

interface Props {
  course: Course
}

export default function CourseInfo({ course }: Props) {
  return (
    <div>
      <div className='flex items-center gap-3 mb-4'>
        <span className='px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-700'>
          {course.category || 'General'}
        </span>
        <span className='text-sm text-text-muted'>Actualizado recientemente</span>
      </div>

      <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight'>
        {course.course_name}
      </h1>

      <p className='text-lg text-text-secondary leading-relaxed mb-6'>
        {course.description}
      </p>

      <div className='flex flex-wrap items-center gap-6'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center text-sm font-medium text-text-secondary'>
            {course.full_name?.[0] || '?'}
          </div>
          <div>
            <p className='text-sm font-medium text-text-primary'>{course.full_name || 'Instructor'}</p>
            <p className='text-xs text-text-muted'>Docente</p>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <svg className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <span className='text-sm font-semibold text-text-primary'>{course.rating_avg}</span>
          <span className='text-sm text-text-muted'>({course.student_count} estudiantes)</span>
        </div>
      </div>
      
    </div>
  )
}
