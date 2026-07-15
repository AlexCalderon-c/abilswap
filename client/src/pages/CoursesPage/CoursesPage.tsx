import { useState } from 'react'
import type { Course } from '../../types'
import CourseFilters from '../../components/courses/CourseFilters/CourseFilters'
import CourseGrid from '../../components/courses/CourseGrid/CourseGrid'
import { useAuth } from '../../context/AuthContext'
import { Navigate, useLoaderData } from 'react-router-dom'
import { useCourse } from '../../context/CourseContext'

const allCourses: Course[] = [
  { id: 1, course_name: 'Desarrollo Web Fullstack Completo', description: 'Aprende React, Node.js, TypeScript y PostgreSQL desde cero hasta desplegar aplicaciones completas.', price: 49.99, teacher_name: 'Carlos Mendoza', category: 'Fullstack', rating_avg: 4.9, student_count: 1240 },
  { id: 2, course_name: 'React & TypeScript Avanzado', description: 'Patrones avanzados, state management, testing y optimización de rendimiento en React.', price: 39.99, teacher_name: 'Ana García', category: 'Frontend', rating_avg: 4.8, student_count: 890 },
  { id: 3, course_name: 'Node.js & APIs Escalables', description: 'Arquitectura limpia, autenticación, bases de datos y despliegue de APIs REST.', price: 44.99, teacher_name: 'Miguel Torres', category: 'Backend', rating_avg: 4.7, student_count: 675 },
  { id: 4, course_name: 'Bases de Datos & SQL', description: 'Diseño de esquemas, consultas avanzadas, optimización y PostgreSQL.', price: 34.99, teacher_name: 'Laura Jiménez', category: 'Backend', rating_avg: 4.8, student_count: 920 },
  { id: 5, course_name: 'TypeScript Profesional', description: 'Tipado avanzado, genéricos, decoradores y patrones con TypeScript.', price: 29.99, teacher_name: 'Carlos Mendoza', category: 'Frontend', rating_avg: 4.6, student_count: 540 },
  { id: 6, course_name: 'DevOps para Desarrolladores', description: 'Docker, CI/CD, cloud computing y automatización para equipos de desarrollo.', price: 54.99, teacher_name: 'Sofia Ruiz', category: 'DevOps', rating_avg: 4.5, student_count: 320 },
]

export default function CoursesPage() {
  
  const {isAuthenticated} = useAuth()
  const courseLoaded = useLoaderData()
  const [filteredCourses, setFilteredCourses] = useState(courseLoaded.courses)

  const searchHandler = (value: string) => {
    const newValue = courseLoaded.courses.filter((obj: Course) => obj.course_name.toLowerCase().includes(value.toLowerCase()))
    setFilteredCourses(newValue)
  }

  const categoryHandler = (category: string) => {

    const newValue = courseLoaded.courses.filter((obj: Course) => category === 'Todas' ? true : obj.category === category)
    setFilteredCourses(newValue)
  }

  const sortHandler = () => {
    
  }
  console.log(isAuthenticated)
 
  

  if (!isAuthenticated){
    return <Navigate to={'../login'}/>
  }

  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-3'>Todos los cursos</h1>
          <p className='text-lg text-text-secondary'>Encuentra el curso perfecto para tu aprendizaje</p>
        </div>

        <div className='grid lg:grid-cols-4 gap-8'>
          <aside className='lg:col-span-1'>
            <CourseFilters onSearch={searchHandler} onCategoryChange={categoryHandler} onSortChange={sortHandler} />
          </aside>
          <div className='lg:col-span-3'>
            <CourseGrid courses={filteredCourses} />
          </div>
        </div>
      </div>
    </div>
  )
}
