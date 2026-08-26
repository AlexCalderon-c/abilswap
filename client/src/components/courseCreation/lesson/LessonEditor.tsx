import { useState, useRef, useCallback } from 'react'
import React from 'react'
import { TextInput } from '../inputs/BasicInputs'
import { ContentTypeSelector, ContentTypeBadge } from '../inputs/ContentTypeSelector'
import { TextContentEditor } from '../inputs/TextContentEditor'
import { VideoContentEditor } from '../inputs/VideoContentEditor'
import { QuizContentEditor } from '../inputs/QuizContentEditor'
import { ArticleContentEditor } from '../inputs/ArticleContentEditor'
import { type LessonFormData, type ContentType } from '../../../types/courseCreation'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

interface QuizContent {
  tagline?: string
  intro?: string
  questions: QuizQuestion[]
}

interface Props {
  lesson: LessonFormData
  index: number
  onUpdate: (lesson: LessonFormData) => void
  onDelete: (lessonId: string) => void
  onDuplicate: (lesson: LessonFormData) => void
}

export const LessonEditor = React.memo(function LessonEditor({ lesson, index, onUpdate, onDelete, onDuplicate }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false)

  const lessonRef = useRef(lesson)
  lessonRef.current = lesson

  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  const updateLesson = useCallback((updates: Partial<LessonFormData>) => {
    onUpdateRef.current({ ...lessonRef.current, ...updates })
  }, [])

  const handleContentTypeChange = useCallback((newType: ContentType) => {
    if (newType === lessonRef.current.content_type) return

    const newLesson: LessonFormData = {
      ...lessonRef.current,
      content_type: newType,
      video_url: newType === 'video' ? lessonRef.current.video_url : '',
      content: newType !== 'video'
        ? {
            tagline: lessonRef.current.content?.tagline || '',
            intro: lessonRef.current.content?.intro || '',
            section: lessonRef.current.content?.section || [
              { id: `section-${Date.now()}`, heading: '', paragraph: [''], code: '', image: '', caption: '' }
            ],
            takeaways: lessonRef.current.content?.takeaways || [''],
          }
        : undefined,
    }
    onUpdateRef.current(newLesson)
    setShowContentTypeSelector(false)
  }, [])

  const handleLessonNameChange = useCallback((v: string) => {
    updateLesson({ lesson_name: v })
  }, [updateLesson])

  const handleContentChange = useCallback((content: LessonFormData['content']) => {
    updateLesson({ content })
  }, [updateLesson])

  const handleVideoUrlChange = useCallback((url: string) => {
    updateLesson({ video_url: url })
  }, [updateLesson])

  const handleQuizChange = useCallback((c: QuizContent) => {
    updateLesson({
      content: {
        tagline: c.tagline,
        intro: c.intro,
        section: c.questions.map((q) => ({
          id: q.id,
          heading: q.question,
          paragraph: q.options,
          code: '',
          image: '',
          caption: '',
        })),
        takeaways: [],
      }
    })
  }, [updateLesson])

  const ContentEditor = useCallback(() => {
    switch (lessonRef.current.content_type) {
      case 'text':
        return lessonRef.current.content && (
          <TextContentEditor content={lessonRef.current.content} onChange={handleContentChange} />
        )
      case 'video':
        return (
          <VideoContentEditor
            videoUrl={lessonRef.current.video_url || ''}
            onChange={handleVideoUrlChange}
          />
        )
      case 'quiz':
        return lessonRef.current.content && (
          <QuizContentEditor
            content={{
              tagline: lessonRef.current.content.tagline || '',
              intro: lessonRef.current.content.intro || '',
              questions: lessonRef.current.content.section.map((s) => ({
                id: s.id,
                question: s.heading,
                options: s.paragraph,
                correctAnswer: 0,
                explanation: '',
                points: 1,
              })),
            }}
            onChange={handleQuizChange}
          />
        )
      case 'article':
        return lessonRef.current.content && (
          <ArticleContentEditor content={lessonRef.current.content} onChange={handleContentChange} />
        )
      default:
        return null
    }
  }, [handleContentChange, handleVideoUrlChange, handleQuizChange])

  return (
    <div className='bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary-200'>
      <div
        className='flex items-center gap-3 px-5 py-4 bg-surface-secondary border-b border-border cursor-pointer hover:bg-surface-tertiary transition-colors'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center flex-shrink-0'>
          {index + 1}
        </div>

        <ContentTypeBadge type={lesson.content_type} size='sm' />

        <TextInput
          value={lesson.lesson_name}
          onChange={handleLessonNameChange}
          placeholder='Título de la lección'
          className='flex-1 min-w-0 max-w-md'
        />

        <div className='flex items-center gap-2 ml-auto'>
          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); setShowContentTypeSelector(true) }}
            className='p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-xl transition-colors'
            aria-label='Cambiar tipo de contenido'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm0-4a1 1 0 011-1h7a1 1 0 110 2H8a1 1 0 01-1-1zm0-4a1 1 0 011-1h7a1 1 0 110 2H8a1 1 0 01-1-1z' />
            </svg>
          </button>

          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); onDuplicate(lesson) }}
            className='p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-xl transition-colors'
            aria-label='Duplicar lección'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </button>

          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); onDelete(lesson.id) }}
            className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors'
            aria-label='Eliminar lección'
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
        <div className='p-5 animate-slide-down'>
          {ContentEditor()}
        </div>
      )}

      {showContentTypeSelector && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in' onClick={() => setShowContentTypeSelector(false)}>
          <div className='bg-surface rounded-2xl p-6 w-full max-w-md animate-slide-up' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-text-primary'>Cambiar tipo de contenido</h3>
              <button
                type='button'
                onClick={() => setShowContentTypeSelector(false)}
                className='p-2 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-xl transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <ContentTypeSelector
              value={lesson.content_type}
              onChange={handleContentTypeChange}
            />
          </div>
        </div>
      )}
    </div>
  )
})