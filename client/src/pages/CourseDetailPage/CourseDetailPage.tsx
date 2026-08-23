import type { Course, Module, Lesson } from '../../types'
import CourseInfo from '../../components/courseDetail/CourseInfo/CourseInfo'
import ModuleAccordion from '../../components/courseDetail/ModuleAccordion/ModuleAccordion'
import CourseSidebar from '../../components/courseDetail/CourseSidebar/CourseSidebar'
import { useLoaderData } from 'react-router-dom'

export default function CourseDetailPage() {

  const loadedData = useLoaderData()

  console.log(loadedData)
  console.log(loadedData.modules[0].lessons)


  return (
    <div className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <CourseInfo course={loadedData.courses} />

            <div>
              <h2 className='text-xl font-bold text-text-primary mb-5'>Contenido del curso</h2>
              <div className='space-y-3'>
                {loadedData.modules.map((mod: Module) => (
                  <ModuleAccordion
                    key={mod.id}
                    module={mod}
                    lessons={mod.lessons}
                    defaultOpen={mod.module_index === 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <CourseSidebar course={loadedData.courses} isEnrolled={loadedData.enroll.isEnrolled} />
          </div>
        </div>
      </div>
    </div>
  )
}
