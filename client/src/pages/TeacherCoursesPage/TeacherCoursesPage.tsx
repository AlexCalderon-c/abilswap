import React, {useState} from 'react'
import { useLoaderData } from 'react-router-dom'
import type { Course } from '../../types'
import TeacherCourses from '../../components/teacherCourses/TeacherCourses'


function TeacherCoursesPage() {
    const courses = useLoaderData()
    const [teacherCourses, setTeacherCourses] = useState(courses)


  return (
      <div className='min-h-screen bg-surface-secondary'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
          <div className='flex items-center justify-between mb-10'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>My Courses</h1>
              <p className='text-text-secondary'>Manage your created courses</p>
            </div>
            <a href='/courses' className='hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all'>Browse Courses</a>
          </div>
            <section className='mb-12'>
                <h2 className='text-lg font-semibold text-text-primary mb-5 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500' /> In Progress
                </h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {teacherCourses.map((course: Course) => <TeacherCourses key={course.id} course={course} />)}
                </div>
            </section>
  
          
        </div>
      </div>
    )
}

export default TeacherCoursesPage