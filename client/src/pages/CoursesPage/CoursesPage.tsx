import { useState } from 'react'
import type { Course } from '../../types'
import CourseFilters from '../../components/courses/CourseFilters/CourseFilters'
import CourseGrid from '../../components/courses/CourseGrid/CourseGrid'
import { Navigate, useLoaderData, useRouteLoaderData } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


export default function CoursesPage() {
  
  const courseLoaded = useLoaderData()
  const {isAuthenticatedState} = useAuth()
  const [filteredCourses, setFilteredCourses] = useState(courseLoaded.courses)

  const searchHandler = (value: string, category: string) => {
    const newValue = courseLoaded.courses.filter((obj: Course) => obj.course_name.toLowerCase().includes(value.toLowerCase()) &&
    (category === 'Todas' || obj.category === category))
    setFilteredCourses(newValue)
  }

  const categoryHandler = (category: string) => {
    const newValue = courseLoaded.courses.filter((obj: Course) => category === 'Todas' ? true : obj.category === category)
    setFilteredCourses(newValue)
  }

  const sortHandler = () => {
    
  }
  console.log(isAuthenticatedState)

  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-3'>Todos los cursos</h1>
          <p className='text-lg text-text-secondary'>Encuentra el curso perfecto para tu aprendizaje</p>
        </div>

        <div className='grid lg:grid-cols-4 gap-8'>
          <aside className='lg:col-span-1'>
            <CourseFilters onSearch={searchHandler} onSortChange={sortHandler} />
          </aside>
          <div className='lg:col-span-3'>
            <CourseGrid courses={filteredCourses} />
          </div>
        </div>
      </div>
    </div>
  )
}
