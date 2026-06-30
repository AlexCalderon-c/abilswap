import type { Course, Module, Lesson } from '../../types'
import CourseInfo from '../../components/courseDetail/CourseInfo/CourseInfo'
import ModuleAccordion from '../../components/courseDetail/ModuleAccordion/ModuleAccordion'
import CourseSidebar from '../../components/courseDetail/CourseSidebar/CourseSidebar'

const mockCourse: Course = {
  id: 1,
  course_name: 'Desarrollo Web Fullstack Completo',
  description: 'Aprende React, Node.js, TypeScript y PostgreSQL desde cero hasta desplegar aplicaciones completas. Este curso te guiará paso a paso a través de las tecnologías más demandadas en el mercado laboral actual. Construirás proyectos reales mientras aprendes buenas prácticas y arquitectura limpia.',
  price: 49.99,
  teacher_name: 'Carlos Mendoza',
  category: 'Fullstack',
  rating_avg: 4.9,
  student_count: 1240,
  created_at: '2024-01-15',
}

const mockModules: Module[] = [
  { id: 1, module_name: 'Fundamentos de Desarrollo Web', module_index: 1, course_id: 1 },
  { id: 2, module_name: 'React & TypeScript', module_index: 2, course_id: 1 },
  { id: 3, module_name: 'Node.js & Express', module_index: 3, course_id: 1 },
  { id: 4, module_name: 'Bases de Datos & PostgreSQL', module_index: 4, course_id: 1 },
  { id: 5, module_name: 'Despliegue & Producción', module_index: 5, course_id: 1 },
]

const mockLessons: Record<number, Lesson[]> = {
  1: [
    { id: 1, lesson_name: 'Introducción al desarrollo web', module_id: 1, content_type: 'video', lesson_index: 1 },
    { id: 2, lesson_name: 'HTML5 semántico y accesibilidad', module_id: 1, content_type: 'video', lesson_index: 2 },
    { id: 3, lesson_name: 'CSS moderno: Flexbox y Grid', module_id: 1, content_type: 'video', lesson_index: 3 },
    { id: 4, lesson_name: 'Ejercicio práctico: Maquetación', module_id: 1, content_type: 'quiz', lesson_index: 4 },
    { id: 5, lesson_name: 'Guía de referencia HTML/CSS', module_id: 1, content_type: 'pdf', lesson_index: 5 },
  ],
  2: [
    { id: 6, lesson_name: 'Introducción a React', module_id: 2, content_type: 'video', lesson_index: 1 },
    { id: 7, lesson_name: 'Componentes y props', module_id: 2, content_type: 'video', lesson_index: 2 },
    { id: 8, lesson_name: 'TypeScript con React', module_id: 2, content_type: 'text', lesson_index: 3 },
    { id: 9, lesson_name: 'Quiz: TypeScript básico', module_id: 2, content_type: 'quiz', lesson_index: 4 },
  ],
  3: [
    { id: 10, lesson_name: 'Node.js runtime', module_id: 3, content_type: 'video', lesson_index: 1 },
    { id: 11, lesson_name: 'Express: Rutas y middlewares', module_id: 3, content_type: 'video', lesson_index: 2 },
    { id: 12, lesson_name: 'Autenticación con JWT', module_id: 3, content_type: 'video', lesson_index: 3 },
  ],
  4: [
    { id: 13, lesson_name: 'Diseño de esquemas relacionales', module_id: 4, content_type: 'video', lesson_index: 1 },
    { id: 14, lesson_name: 'Consultas SQL avanzadas', module_id: 4, content_type: 'text', lesson_index: 2 },
    { id: 15, lesson_name: 'PostgreSQL con Node.js', module_id: 4, content_type: 'video', lesson_index: 3 },
  ],
  5: [
    { id: 16, lesson_name: 'Docker para desarrolladores', module_id: 5, content_type: 'video', lesson_index: 1 },
    { id: 17, lesson_name: 'CI/CD con GitHub Actions', module_id: 5, content_type: 'video', lesson_index: 2 },
    { id: 18, lesson_name: 'Despliegue en producción', module_id: 5, content_type: 'video', lesson_index: 3 },
  ],
}

export default function CourseDetailPage() {
  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <CourseInfo course={mockCourse} />

            <div>
              <h2 className='text-xl font-bold text-text-primary mb-5'>Contenido del curso</h2>
              <div className='space-y-3'>
                {mockModules.map((mod) => (
                  <ModuleAccordion
                    key={mod.id}
                    module={mod}
                    lessons={mockLessons[mod.id] || []}
                    defaultOpen={mod.module_index === 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <CourseSidebar course={mockCourse} />
          </div>
        </div>
      </div>
    </div>
  )
}
