import { useState, type Dispatch, type SetStateAction } from 'react'
import { useCourse } from '../../../context/CourseContext'
import type { Course } from '../../../types'
import { useRevalidator, useRouteLoaderData } from 'react-router-dom'

interface Props {
  course: Course
  isEnrolled: boolean
  setEnroll: Dispatch<SetStateAction<Boolean>>
}

export default function CourseSidebar({ course, isEnrolled, setEnroll }: Props) {
  const loadedUser = useRouteLoaderData('auth')
  const revalidator = useRevalidator()
  const {enrollCourse} = useCourse()
  const [enrollButton, setEnrollButton] = useState(!isEnrolled)
  console.log('Desde sidebar: ', loadedUser)

  const submitHandler = () => {
    setEnrollButton(false)
    enrollCourse(course.id)
    setEnroll(true)
  }

  return (
    <div className='sticky top-24'>
      <div className='bg-white rounded-2xl border border-border overflow-hidden shadow-sm'>
        <div className='h-48 bg-gradient-to-br from-primary-500 to-accent-500 relative' />

        <div className='p-6 space-y-5'>
          <div>
            <p className='text-3xl font-bold text-text-primary'>
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </p>
            {course.price > 0 && (
              <p className='text-sm text-text-muted mt-1'>One-time payment · Lifetime access</p>
            )}
          </div>

            {enrollButton === true && loadedUser.user.role === 'student' ? 
              <button onClick={submitHandler} className='w-full py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer'>
              Enroll Now
              </button>
            :
              <></>}
          

          <hr className='border-border' />

          <div className='space-y-3'>
            <h4 className='text-sm font-semibold text-text-primary'>This course includes:</h4>
            <div className='space-y-2.5 text-sm text-text-secondary'>
              <div className='flex items-center gap-2.5'>
                <svg className='w-4 h-4 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                </svg>
                <span>20 hours of video</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <svg className='w-4 h-4 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span>15 practical exercises</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <svg className='w-4 h-4 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span>Certificate upon completion</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <svg className='w-4 h-4 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span>Lifetime access</span>
              </div>
            </div>
          </div>

          <hr className='border-border' />

          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center text-sm font-medium text-text-secondary'>
              {course.full_name?.[0] || '?'}
            </div>
            <div>
              <p className='text-sm font-medium text-text-primary'>{course.full_name || 'Instructor'}</p>
              <p className='text-xs text-text-muted'>Course Creator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
