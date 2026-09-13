import type { Enrollment } from '../../types'
import EnrolledCourseCard from '../../components/dashboard/EnrolledCourseCard/EnrolledCourseCard'
import { useLoaderData } from 'react-router-dom'
import { useState } from 'react'

export default function DashboardPage() {
  
  const dashboard = useLoaderData()
  const [enrollment, setEnrollment] = useState(dashboard)
  console.log(enrollment)

  const active = enrollment.filter((e: Enrollment) => e.enrollment_status === 'active')
  const completed = enrollment.filter((e: Enrollment) => e.enrollment_status === 'completed')

  const [activeEnrollment, setActiveEnrollment] = useState(active)
  const [completeEnrollment, setCompleteEnrollment] = useState(completed)

  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>My Courses</h1>
            <p className='text-text-secondary'>Manage your learning and track your progress</p>
          </div>
          <a href='/courses' className='hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all'>Browse Courses</a>
        </div>

        {activeEnrollment.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-lg font-semibold text-text-primary mb-5 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-emerald-500' /> In Progress
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {activeEnrollment.map((e: Enrollment) => <EnrolledCourseCard key={e.enrollment_id} enrollment={e} />)}
            </div>
          </section>
        )}

        {completeEnrollment.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-lg font-semibold text-text-primary mb-5 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-blue-500' /> Completed
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {completeEnrollment.map((e: Enrollment) => <EnrolledCourseCard key={e.enrollment_id} enrollment={e} />)}
            </div>
          </section>
        )}

        {activeEnrollment.length === 0 && completeEnrollment === 0 && (
          <div className='text-center py-20'>
            <p className='text-lg font-medium text-text-primary'>You have no enrolled courses</p>
            <a href='/courses' className='mt-4 inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl'>Browse Courses</a>
          </div>
        )}
      </div>
    </div>
  )
}
