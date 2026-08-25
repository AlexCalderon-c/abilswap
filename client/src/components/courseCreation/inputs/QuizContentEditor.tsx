import { useState } from 'react'
import { TextInput, TextareaInput, NumberInput } from './BasicInputs'
import { SortableList } from './SortableList'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

interface Props {
  content: {
    tagline?: string
    intro?: string
    questions: QuizQuestion[]
  }
  onChange: (content: {
    tagline?: string
    intro?: string
    questions: QuizQuestion[]
  }) => void
}

function createEmptyQuestion(): QuizQuestion {
  return {
    id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1,
  }
}

export function QuizContentEditor({ content, onChange }: Props) {
  const [questions, setQuestions] = useState(content.questions.length > 0 ? content.questions : [createEmptyQuestion()])

  const updateContent = (updates: Partial<typeof content>) => {
    onChange({ ...content, ...updates })
  }

  const handleQuestionUpdate = (updatedQuestion: QuizQuestion) => {
    const newQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    )
    setQuestions(newQuestions)
    updateContent({ questions: newQuestions })
  }

  const handleQuestionDelete = (questionId: string) => {
    if (questions.length <= 1) return
    const newQuestions = questions.filter((q) => q.id !== questionId)
    setQuestions(newQuestions)
    updateContent({ questions: newQuestions })
  }

  const addQuestion = () => {
    const newQuestions = [...questions, createEmptyQuestion()]
    setQuestions(newQuestions)
    updateContent({ questions: newQuestions })
  }

  const handleReorderQuestions = (items: { id: string; data: QuizQuestion }[]) => {
    const newQuestions = items.map((item) => item.data)
    setQuestions(newQuestions)
    updateContent({ questions: newQuestions })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <TextInput
          value={content.tagline || ''}
          onChange={(v) => updateContent({ tagline: v || undefined })}
          placeholder='Tagline / Subtítulo breve'
          label='Tagline'
        />
        <TextareaInput
          value={content.intro || ''}
          onChange={(v) => updateContent({ intro: v || undefined })}
          placeholder='Introducción al quiz...'
          label='Introducción'
          rows={4}
        />
      </div>

      <div className='pt-4 border-t border-border'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-text-primary flex items-center gap-2'>
            <svg className='w-5 h-5 text-amber-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            Preguntas
          </h3>
          <button
            type='button'
            onClick={addQuestion}
            className='px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Añadir pregunta
          </button>
        </div>

        <SortableList
          items={questions.map((q) => ({ id: q.id, data: q }))}
          onReorder={handleReorderQuestions}
          renderItem={(item, index) => (
            <QuestionEditor
              question={item.data}
              index={index}
              onUpdate={handleQuestionUpdate}
              onDelete={() => handleQuestionDelete(item.id)}
            />
          )}
          placeholder={
            <div className='h-32 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center bg-amber-50' />
          }
        />
      </div>
    </div>
  )
}

interface QuestionEditorProps {
  question: QuizQuestion
  index: number
  onUpdate: (question: QuizQuestion) => void
  onDelete: () => void
}

function QuestionEditor({ question, index, onUpdate, onDelete }: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [options, setOptions] = useState(question.options)

  const updateQuestion = (updates: Partial<QuizQuestion>) => {
    onUpdate({ ...question, ...updates })
  }

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...options]
    newOptions[optionIndex] = value
    setOptions(newOptions)
    updateQuestion({ options: newOptions })
  }

  const addOption = () => {
    if (options.length >= 6) return
    const newOptions = [...options, '']
    setOptions(newOptions)
    updateQuestion({ options: newOptions })
  }

  const removeOption = (optionIndex: number) => {
    if (options.length <= 2) return
    const newOptions = options.filter((_, i) => i !== optionIndex)
    setOptions(newOptions)
    const newCorrectAnswer = question.correctAnswer >= newOptions.length
      ? newOptions.length - 1
      : question.correctAnswer
    updateQuestion({ options: newOptions, correctAnswer: newCorrectAnswer })
  }

  return (
    <div className='bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary-200'>
      <div
        className='flex items-center gap-3 px-5 py-4 bg-surface-secondary border-b border-border cursor-pointer hover:bg-surface-tertiary transition-colors'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='w-8 h-8 rounded-lg bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center flex-shrink-0'>
          {index + 1}
        </div>
        <TextInput
          value={question.question}
          onChange={(v) => updateQuestion({ question: v })}
          placeholder='Escribe tu pregunta...'
          className='flex-1 min-w-0'
        />
        <div className='flex items-center gap-2'>
          <NumberInput
            value={String(question.points)}
            onChange={(v) => updateQuestion({ points: parseFloat(v) || 1 })}
            label='Pts'
            min={1}
            max={10}
            className='w-20'
          />
          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors'
            aria-label='Eliminar pregunta'
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
        <div className='p-5 space-y-4 animate-slide-down'>
          <div className='space-y-3'>
            <label className='block text-sm font-medium text-text-secondary'>Opciones de respuesta</label>
            <div className='space-y-2'>
              {options.map((option, oIndex) => (
                <div key={oIndex} className='flex items-center gap-2'>
                  <label className='flex items-center gap-2 cursor-pointer flex-1 min-w-0'>
                    <input
                      type='radio'
                      name={`question-${question.id}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => updateQuestion({ correctAnswer: oIndex })}
                      className='w-4 h-4 text-primary-600 border-border focus:ring-primary-500'
                    />
                    <TextInput
                      value={option}
                      onChange={(v) => handleOptionChange(oIndex, v)}
                      placeholder={`Opción ${oIndex + 1}`}
                      className='flex-1 min-w-0 mb-0'
                    />
                  </label>
                  {options.length > 2 && (
                    <button
                      type='button'
                      onClick={() => removeOption(oIndex)}
                      className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors'
                      aria-label={`Eliminar opción ${oIndex + 1}`}
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type='button'
                  onClick={addOption}
                  className='w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 hover:border-primary-500 hover:bg-primary-50 transition-colors'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Añadir opción
                </button>
              )}
            </div>
          </div>

          <TextareaInput
            value={question.explanation || ''}
            onChange={(v) => updateQuestion({ explanation: v || undefined })}
            placeholder='Explicación de la respuesta correcta (opcional)'
            label='Explicación'
            rows={3}
          />
        </div>
      )}
    </div>
  )
}