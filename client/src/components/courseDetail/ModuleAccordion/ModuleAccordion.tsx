import { useState } from 'react'
import type { Module } from '../../../types'
import type { Lesson } from '../../../types'
import LessonItem from '../LessonItem/LessonItem'

interface Props {
  module: Module
  lessons: Lesson[]
  defaultOpen?: boolean
}

export default function ModuleAccordion({ module, lessons, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className='border border-border rounded-xl overflow-hidden bg-white transition-all duration-200'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-secondary transition-colors'
      >
        <div className='flex items-center gap-3'>
          <span className='w-7 h-7 rounded-lg bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center'>
            {module.module_index}
          </span>
          <div>
            <p className='font-medium text-sm text-text-primary'>{module.module_name}</p>
            <p className='text-xs text-text-muted mt-0.5'>{lessons.length} lecciones</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='border-t border-border divide-y divide-border animate-slide-down'>
          {lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}
