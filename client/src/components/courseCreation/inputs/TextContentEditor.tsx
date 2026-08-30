import { TextInput, TextareaInput } from './BasicInputs'
import { SectionEditor } from './SectionEditor'
import { TakeawaysEditor } from './TakeawaysEditor'
import { type LessonContentFormData, type SectionFormData } from '../../../types/courseCreation'
import { SortableList } from './SortableList'
import { useCallback } from 'react'
import React, {useRef} from 'react'

interface Props {
  content: LessonContentFormData
  onChange: (content: LessonContentFormData) => void
}

export const TextContentEditor = React.memo(function TextContentEditor({ content, onChange }: Props) {
  const contentRef = useRef(content)
  contentRef.current = content

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleSectionUpdate = useCallback((updatedSection: SectionFormData) => {
    const newSections = contentRef.current.section.map((s) =>
      s.id === updatedSection.id ? updatedSection : s
    )
    onChangeRef.current({ ...contentRef.current, section: newSections })
  }, [])

  const handleSectionDelete = useCallback((sectionId: string) => {
    if (contentRef.current.section.length <= 1) return
    onChangeRef.current({ ...contentRef.current, section: contentRef.current.section.filter((s) => s.id !== sectionId) })
  }, [])

  const addSection = useCallback(() => {
    const newSection: SectionFormData = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      heading: '',
      paragraph: [''],
      code: '',
      image: '',
      caption: '',
    }
    onChangeRef.current({ ...contentRef.current, section: [...contentRef.current.section, newSection] })
  }, [])

  const handleReorderSections = useCallback((sections: { id: string; data: SectionFormData }[]) => {
    onChangeRef.current({ ...contentRef.current, section: sections.map((s) => s.data) })
  }, [])

  const handleTakeawaysChange = useCallback((takeaways: string[]) => {
    onChangeRef.current({ ...contentRef.current, takeaways })
  }, [])

  const handleTaglineChange = useCallback((v: string) => {
    onChangeRef.current({ ...contentRef.current, tagline: v || undefined })
  }, [])

  const handleIntroChange = useCallback((v: string) => {
    onChangeRef.current({ ...contentRef.current, intro: v || undefined })
  }, [])

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <TextInput
          value={content.tagline || ''}
          onChange={handleTaglineChange}
          placeholder='Tagline / Subtítulo breve'
          label='Tagline'
        />
        <TextareaInput
          value={content.intro || ''}
          onChange={handleIntroChange}
          placeholder='Introducción a la lección...'
          label='Introducción'
          rows={4}
        />
      </div>

      <div className='pt-4 border-t border-border'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-text-primary flex items-center gap-2'>
            <svg className='w-5 h-5 text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            Secciones
          </h3>
          <button
            type='button'
            onClick={addSection}
            className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Añadir sección
          </button>
        </div>

        <SortableList
          items={content.section.map((s) => ({ id: s.id, data: s }))}
          onReorder={handleReorderSections}
          renderItem={(item, index) => (
            <SectionEditor
              section={item.data}
              index={index}
              onUpdate={handleSectionUpdate}
              onDelete={handleSectionDelete}
            />
          )}
          placeholder={
            <div className='h-32 border-2 border-dashed border-primary-300 rounded-2xl flex items-center justify-center bg-primary-50' />
          }
        />
      </div>

      <div className='pt-4 border-t border-border'>
        <TakeawaysEditor
          takeaways={content.takeaways}
          onChange={handleTakeawaysChange}
        />
      </div>
    </div>
  )
})