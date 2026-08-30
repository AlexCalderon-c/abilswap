import type { Enrollment } from '../../../types'
import ProgressBar from '../ProgressBar/ProgressBar'

interface Props {
  enrollment: Enrollment
}

export default function EnrolledCourseCard({ enrollment }: Props) {

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    dropped: 'bg-red-100 text-red-700',
  }

  return (
    <div className='group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
      <div className='h-32 bg-gradient-to-br from-primary-400 to-accent-400 relative'>
        <div className='absolute inset-0 bg-black/10' />
        <div className='absolute top-3 right-3'>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize ${statusColors[enrollment.enrollment_status]}`}>
            {enrollment.enrollment_status === 'active' ? 'En progreso' : enrollment.enrollment_status === 'completed' ? 'Completado' : 'Abandonado'}
          </span>
        </div>
      </div>

      <div className='p-5'>
        <h3 className='font-semibold text-text-primary group-hover:text-primary-600 transition-colors mb-1'>
          {enrollment.course_name}
        </h3>

        <ProgressBar progress={enrollment.progress} />

        <a
          href={`/courses/${enrollment.course_id}`}
          className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors'
        >
          Continuar curso
          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
          </svg>
        </a>
      </div>
    </div>
  )
}
