import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseBasicInfo } from '../../components/courseCreation/course/CourseBasicInfo'
import { ModuleEditor } from '../../components/courseCreation/module/ModuleEditor'
import { SortableList } from '../../components/courseCreation/inputs/SortableList'
import { apiClient } from '../../api/axios'
import {
  type CourseFormData,
  type ModuleFormData,
  type LessonFormData,
  createEmptyModule,
} from '../../types/courseCreation'

const INITIAL_COURSE_DATA: CourseFormData = {
  course_name: '',
  description: '',
  price: 0,
  category: '',
  image_url: '',
}

export function CreateCoursePage() {
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState<CourseFormData>(INITIAL_COURSE_DATA)
  const [modules, setModules] = useState<ModuleFormData[]>([createEmptyModule()])
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData | keyof ModuleFormData | keyof LessonFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info')

  const validateCourse = useCallback(() => {
    const newErrors: Partial<Record<keyof CourseFormData | keyof ModuleFormData | keyof LessonFormData, string>> = {}

    if (!courseData.course_name.trim()) {
      newErrors.course_name = 'Course name is required'
    } else if (courseData.course_name.length < 6) {
      newErrors.course_name = 'Name must be at least 6 characters'
    } else if (courseData.course_name.length > 150) {
      newErrors.course_name = 'Name cannot exceed 150 characters'
    }

    if (!courseData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (courseData.description.length > 3000) {
      newErrors.description = 'Description cannot exceed 3000 characters'
    }

    modules.forEach((module) => {
      if (module.module_name.length < 8) {
        newErrors[`module_name`] = 'Name must be at least 8 characters'
      }

      module.lessons.forEach((lesson) => {
        if (lesson.lesson_name.length < 8) {
          newErrors[`lesson_name`] = 'Name must be at least 8 characters'
        }
      })
    })

    if (courseData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    if (courseData.image_url && courseData.image_url.trim()) {
      try {
        new URL(courseData.image_url)
      } catch {
        newErrors.image_url = 'Invalid image URL'
      }
    }

    

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [courseData])

  const handleCourseChange = useCallback((updates: Partial<CourseFormData>) => {
    setCourseData((prev) => ({ ...prev, ...updates }))
    if (errors[Object.keys(updates)[0] as keyof CourseFormData]) {
      setErrors((prev) => ({ ...prev, [Object.keys(updates)[0]]: undefined }))
    }
  }, [errors])

  const handleModuleUpdate = useCallback((updatedModule: ModuleFormData) => {
    setModules((prev) =>
      prev.map((m) => (m.id === updatedModule.id ? updatedModule : m))
    )
  }, [])

  const handleModuleDelete = useCallback((moduleId: string) => {
    if (modules.length <= 1) return
    setModules((prev) => prev.filter((m) => m.id !== moduleId))
  }, [modules.length])

  const handleModuleDuplicate = useCallback((module: ModuleFormData) => {
    const duplicatedModule: ModuleFormData = {
      ...module,
      id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      module_name: `${module.module_name} (copy)`,
      lessons: module.lessons.map((l) => ({
        ...l,
        id: `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lesson_name: `${l.lesson_name} (copy)`,
      })),
    }
    const moduleIndex = modules.findIndex((m) => m.id === module.id)
    setModules((prev) => {
      const newModules = [...prev]
      newModules.splice(moduleIndex + 1, 0, duplicatedModule)
      return newModules
    })
  }, [modules])

  const addModule = useCallback(() => {
    setModules((prev) => [...prev, createEmptyModule()])
  }, [])

  const handleReorderModules = useCallback((items: { id: string; data: ModuleFormData }[]) => {
    setModules(items.map((item) => item.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateCourse()) {
      setActiveTab('info')
      return
    }

    if (modules.length === 0 || modules.every((m) => m.lessons.length === 0)) {
      setSubmitError('You must add at least one module with a lesson')
      setActiveTab('content')
      return
    }

    setIsSubmitting(true)

    try {
      const courseResponse = await apiClient.post('/api/course', {
        course_name: courseData.course_name,
        description: courseData.description,
        price: courseData.price,
        category: courseData.category || undefined,
        image_url: courseData.image_url || undefined,
      })

      const courseId = courseResponse.data.id

      for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
        const module = modules[moduleIndex]
        if (!module.module_name.trim()) continue
        console.log("MODULE INFO: ", module)

        const moduleResponse = await apiClient.post(`/api/module/${courseId}`, {
          module_name: module.module_name,
        })

        const moduleId = moduleResponse.data.id

        for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
          const lesson = module.lessons[lessonIndex]
          if (!lesson.lesson_name.trim()) continue

          const lessonData: Record<string, unknown> = {
            lesson_name: lesson.lesson_name,
            content_type: lesson.content_type,
            module_id: moduleId,
          }

          if (lesson.content_type === 'video') {
            lessonData.video_url = lesson.video_url
          } else if (lesson.content) {
            lessonData.content = lesson.content
          }

          console.log('LESSON INFO: ', lessonData)

          await apiClient.post(`/api/lesson/${moduleId}`, lessonData)
        }
      }

      navigate('/dashboard')
    } catch (error: unknown) {
      console.error('Error creating course:', error)
      const err = error as { response?: { data?: { message?: string } } }
      setSubmitError(err.response?.data?.message || 'Error creating course. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className='min-h-screen bg-surface'>
      {/* Header */}
      <header className='sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-4'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='p-2 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-xl transition-colors'
                aria-label='Go back'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <div>
                <h1 className='text-xl font-bold text-text-primary'>New Course</h1>
                <p className='text-sm text-text-muted'>
                  {modules.length} module{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => {}}
                className='px-4 py-2 text-sm font-medium text-text-secondary bg-surface-secondary rounded-xl hover:bg-surface-tertiary transition-colors'
                disabled={isSubmitting}
              >
                Preview
              </button>
              <button
                type='submit'
                form='course-form'
                disabled={isSubmitting}
                className='px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  'Publish Course'
                )}
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className='flex gap-1 pb-4 border-b border-border'>
            <button
              type='button'
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              Information
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              Content
            </button>
          </div>
        </div>
      </header>

      <form id='course-form' onSubmit={handleSubmit} className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {submitError && (
          <div className='mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3 animate-slide-down'>
            <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
            </svg>
            {submitError}
          </div>
        )}

        {activeTab === 'info' && (
          <div className='space-y-8 animate-fade-in'>
            <CourseBasicInfo data={courseData} onChange={handleCourseChange} errors={errors} />
          </div>
        )}

        {activeTab === 'content' && (
          <div className='space-y-8 animate-fade-in'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-text-primary'>Modules & Lessons</h2>
                <p className='text-text-muted mt-1'>Organize your course content by dragging and dropping</p>
              </div>
              <button
                type='button'
                onClick={addModule}
                className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className='text-center py-16'>
                <div className='w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-10 h-10 text-primary-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-text-primary mb-2'>No modules yet</h3>
                <p className='text-text-muted mb-6'>Create your first module to start adding lessons</p>
                <button
                  type='button'
                  onClick={addModule}
                  className='px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Create First Module
                </button>
              </div>
            ) : (
              <SortableList
                items={modules.map((m) => ({ id: m.id, data: m }))}
                onReorder={handleReorderModules}
                renderItem={(item, index) => (
                  <ModuleEditor
                    module={item.data}
                    index={index}
                    onUpdate={handleModuleUpdate}
                    onDelete={() => handleModuleDelete(item.id)}
                    onDuplicate={() => handleModuleDuplicate(item.data)}
                    errors={errors}
                  />
                )}
                placeholder={
                  <div className='h-32 border-2 border-dashed border-primary-300 rounded-2xl flex items-center justify-center bg-primary-50' />
                }
              />
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default CreateCoursePage