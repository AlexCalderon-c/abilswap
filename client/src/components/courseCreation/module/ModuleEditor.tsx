import { useState } from 'react'
import { TextInput } from '../inputs/BasicInputs'
import { LessonEditor } from '../lesson/LessonEditor'
import { SortableList } from '../inputs/SortableList'
import { type ModuleFormData, type LessonFormData, createEmptyLesson } from '../../../types/courseCreation'
import { CONTENT_TYPES } from '../../../types/courseCreation'

interface Props {
  module: ModuleFormData
  index: number
  onUpdate: (module: ModuleFormData) => void
  onDelete: () => void
  onDuplicate: () => void
}

export function ModuleEditor({ module, index, onUpdate, onDelete, onDuplicate }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAddLessonMenu, setShowAddLessonMenu] = useState(false)

  const updateModule = (updates: Partial<ModuleFormData>) => {
    onUpdate({ ...module, ...updates })
  }

  const handleLessonUpdate = (updatedLesson: LessonFormData) => {
    const newLessons = module.lessons.map((l) =>
      l.id === updatedLesson.id ? updatedLesson : l
    )
    updateModule({ lessons: newLessons })
  }

  const handleLessonDelete = (lessonId: string) => {
    updateModule({ lessons: module.lessons.filter((l) => l.id !== lessonId) })
  }

  const handleLessonDuplicate = (lesson: LessonFormData) => {
    const duplicatedLesson: LessonFormData = {
      ...lesson,
      id: `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lesson_name: `${lesson.lesson_name} (copia)`,
    }
    const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id)
    const newLessons = [...module.lessons]
    newLessons.splice(lessonIndex + 1, 0, duplicatedLesson)
    updateModule({ lessons: newLessons })
  }

  const addLesson = (contentType: LessonFormData['content_type']) => {
    const newLesson = createEmptyLesson(contentType)
    updateModule({ lessons: [...module.lessons, newLesson] })
    setShowAddLessonMenu(false)
  }

  const handleReorderLessons = (items: { id: string; data: LessonFormData }[]) => {
    updateModule({ lessons: items.map((item) => item.data) })
  }

  return (
    <div className='bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary-200'>
      <div
        className='flex items-center gap-3 px-5 py-4 bg-surface-secondary border-b border-border cursor-pointer hover:bg-surface-tertiary transition-colors'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center flex-shrink-0'>
          {index + 1}
        </div>

        <TextInput
          value={module.module_name}
          onChange={(v) => updateModule({ module_name: v })}
          placeholder='Nombre del módulo'
          className='flex-1 min-w-0 max-w-md'
        />

        <span className='text-sm text-text-muted px-3 py-1 rounded-full bg-surface border border-border'>
          {module.lessons.length} lección{module.lessons.length !== 1 ? 'es' : ''}
        </span>

        <div className='flex items-center gap-2 ml-auto'>
          <button
            type='button'
            onClick={() => setShowAddLessonMenu(true)}
            className='px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 rounded-xl transition-colors flex items-center gap-1.5'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Añadir lección
          </button>

          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className='p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-xl transition-colors'
            aria-label='Duplicar módulo'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </button>

          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors'
            aria-label='Eliminar módulo'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
            </svg>
          </button>

          <button
            type='button'
            onClick={(e) => e.stopPropagation()}
            className='p-2 text-text-muted hover:text-text-primary transition-colors'
            aria-label={isExpanded ? 'Contraer' : 'Expandir'}
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className='animate-slide-down'>
          <SortableList
            items={module.lessons.map((l) => ({ id: l.id, data: l }))}
            onReorder={handleReorderLessons}
            renderItem={(item, lessonIndex) => (
              <LessonEditor
                lesson={item.data}
                index={lessonIndex}
                onUpdate={handleLessonUpdate}
                onDelete={() => handleLessonDelete(item.id)}
                onDuplicate={() => handleLessonDuplicate(item.data)}
              />
            )}
            placeholder={
              <div className='py-12 text-center'>
                <div className='w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3'>
                  <svg className='w-8 h-8 text-primary-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                </div>
                <p className='text-text-muted'>No hay lecciones en este módulo</p>
                <p className='text-sm text-text-muted mt-1'>Haz clic en "Añadir lección" para crear la primera</p>
              </div>
            }
          />
        </div>
      )}

      {showAddLessonMenu && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in' onClick={() => setShowAddLessonMenu(false)}>
          <div className='bg-surface rounded-2xl p-6 w-full max-w-md animate-slide-up' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-text-primary'>Añadir nueva lección</h3>
              <button
                type='button'
                onClick={() => setShowAddLessonMenu(false)}
                className='p-2 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-xl transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <p className='text-sm text-text-secondary mb-4'>Selecciona el tipo de contenido para la lección</p>
            <div className='grid grid-cols-2 gap-3'>
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type='button'
                  onClick={() => addLesson(type.value)}
                  className='p-4 rounded-xl border-2 border-border hover:border-primary-300 hover:bg-primary-50 transition-all text-left group'
                >
                  <div className='text-3xl mb-2'>{type.icon}</div>
                  <div className='font-medium text-text-primary group-hover:text-primary-600'>{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}