import { useScrollAnimation } from '../../../hooks/useScrollAnimation'
import type { Course } from '../../../types'
import CourseCard from '../../courses/CourseCard/CourseCard'

const featuredCourses: Course[] = [
  {
    id: 1,
    course_name: 'Desarrollo Web Fullstack Completo',
    description: 'Aprende React, Node.js, TypeScript y PostgreSQL desde cero hasta desplegar aplicaciones completas.',
    price: 49.99,
    teacher_name: 'Carlos Mendoza',
    category: 'Fullstack',
    rating_avg: 4.9,
    student_count: 1240,
    image_url: '',
  },
  {
    id: 2,
    course_name: 'React & TypeScript Avanzado',
    description: 'Patrones avanzados, state management, testing y optimización de rendimiento en React.',
    price: 39.99,
    teacher_name: 'Ana García',
    category: 'Frontend',
    rating_avg: 4.8,
    student_count: 890,
    image_url: '',
  },
  {
    id: 3,
    course_name: 'Node.js & APIs Escalables',
    description: 'Arquitectura limpia, autenticación, bases de datos y despliegue de APIs REST.',
    price: 44.99,
    teacher_name: 'Miguel Torres',
    category: 'Backend',
    rating_avg: 4.7,
    student_count: 675,
    image_url: '',
  },
  {
    id: 4,
    course_name: 'Bases de Datos & SQL',
    description: 'Diseño de esquemas, consultas avanzadas, optimización y PostgreSQL.',
    price: 34.99,
    teacher_name: 'Laura Jiménez',
    category: 'Backend',
    rating_avg: 4.8,
    student_count: 920,
    image_url: '',
  },
]

export default function FeaturedCourses() {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>()

  return (
    <section ref={ref} className='py-20 md:py-28 bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className='text-sm font-semibold text-primary-600 uppercase tracking-wider'>Cursos destacados</span>
          <h2 className='text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4'>
            Los cursos más populares
          </h2>
          <p className='text-lg text-text-secondary max-w-2xl mx-auto'>
            Elige entre nuestra selección de cursos mejor valorados por la comunidad
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {featuredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`transition-all duration-700 delay-${index * 150} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <a
            href='/courses'
            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors'
          >
            Ver todos los cursos
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
