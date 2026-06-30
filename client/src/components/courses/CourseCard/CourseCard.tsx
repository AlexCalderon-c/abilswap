import type { Course } from '../../../types'

interface Props {
  course: Course
}

const categoryColors: Record<string, string> = {
  Fullstack: 'bg-gradient-to-br from-primary-500 to-accent-500',
  Frontend: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  Backend: 'bg-gradient-to-br from-emerald-500 to-teal-500',
}

export default function CourseCard({ course }: Props) {
  return (
    <a
      href={`/courses/${course.id}`}
      className='group block bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary-200'
    >
      <div className={`h-40 ${categoryColors[course.category ?? ''] || 'bg-gradient-to-br from-primary-500 to-accent-500'} relative overflow-hidden`}>
        <div className='absolute inset-0 bg-black/10' />
        <div className='absolute top-3 left-3'>
          <span className='px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm rounded-md text-text-primary'>
            {course.category || 'General'}
          </span>
        </div>
        <div className='absolute top-3 right-3'>
          <span className='px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm rounded-md text-primary-600'>
            {course.price === 0 ? 'Gratis' : `$${course.price}`}
          </span>
        </div>
      </div>

      <div className='p-5'>
        <h3 className='font-semibold text-text-primary group-hover:text-primary-600 transition-colors mb-2 line-clamp-2'>
          {course.course_name}
        </h3>
        <p className='text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed'>
          {course.description}
        </p>

        <div className='flex items-center justify-between pt-4 border-t border-border'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full bg-surface-tertiary flex items-center justify-center text-xs font-medium text-text-secondary'>
              {course.teacher_name?.[0] || '?'}
            </div>
            <span className='text-xs text-text-muted'>{course.teacher_name || 'Instructor'}</span>
          </div>

          <div className='flex items-center gap-1'>
            <svg className='w-3.5 h-3.5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span className='text-xs font-medium text-text-secondary'>{course.rating_avg?.toFixed(1)}</span>
            <span className='text-xs text-text-muted ml-1'>({course.student_count})</span>
          </div>
        </div>
      </div>
    </a>
  )
}
