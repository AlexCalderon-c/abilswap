import React from 'react'
import type { Course } from '../../types'

interface TeacherProps{
    course: Course
}


function TeacherCourses({course}: TeacherProps) {

  return (
      <div className='group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300'>
        <div className='h-32 bg-gradient-to-br from-primary-400 to-accent-400 relative'>
          <div className='absolute inset-0 bg-black/10' />
          <div className='absolute top-3 right-3'>
          </div>
        </div>
  
        <div className='p-5'>
          <h3 className='font-semibold text-text-primary group-hover:text-primary-600 transition-colors mb-1'>
            {course.course_name}
          </h3>
  
          <a
            href={`/courses/${course.id}`}
            className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors'
          >
            Continue Course
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </div>
      </div>
  )
}

export default TeacherCourses