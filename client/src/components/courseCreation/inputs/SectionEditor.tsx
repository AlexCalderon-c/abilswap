import { useState } from 'react'
import { TextInput, TextareaInput, UrlInput } from './BasicInputs'
import { type SectionFormData } from '../../../types/courseCreation'

interface Props {
  section: SectionFormData
  index: number
  onUpdate: (section: SectionFormData) => void
  onDelete: () => void
}

export function SectionEditor({ section, index, onUpdate, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [paragraphs, setParagraphs] = useState(section.paragraph)
  const [showCode, setShowCode] = useState(!!section.code)
  const [showImage, setShowImage] = useState(!!section.image)

  const updateSection = (updates: Partial<SectionFormData>) => {
    onUpdate({ ...section, ...updates })
  }

  const handleParagraphChange = (paragraphIndex: number, value: string) => {
    const newParagraphs = [...paragraphs]
    newParagraphs[paragraphIndex] = value
    setParagraphs(newParagraphs)
    updateSection({ paragraph: newParagraphs })
  }

  const addParagraph = () => {
    const newParagraphs = [...paragraphs, '']
    setParagraphs(newParagraphs)
    updateSection({ paragraph: newParagraphs })
  }

  const removeParagraph = (paragraphIndex: number) => {
    if (paragraphs.length <= 1) return
    const newParagraphs = paragraphs.filter((_, i) => i !== paragraphIndex)
    setParagraphs(newParagraphs)
    updateSection({ paragraph: newParagraphs })
  }

  const handleCodeChange = (value: string) => {
    updateSection({ code: value || undefined })
  }

  const handleImageChange = (value: string) => {
    updateSection({ image: value || undefined })
  }

  const handleCaptionChange = (value: string) => {
    updateSection({ caption: value || undefined })
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
          value={section.heading}
          onChange={(v) => updateSection({ heading: v })}
          placeholder='Título de la sección'
          className='flex-1 min-w-0'
        />
        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-auto'
          aria-label='Eliminar sección'
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

      {isExpanded && (
        <div className='p-5 space-y-4 animate-slide-down'>
          <div className='space-y-3'>
            <label className='block text-sm font-medium text-text-secondary'>Párrafos</label>
            <div className='space-y-2'>
              {paragraphs.map((paragraph, pIndex) => (
                <div key={pIndex} className='flex gap-2'>
                  <TextareaInput
                    value={paragraph}
                    onChange={(v) => handleParagraphChange(pIndex, v)}
                    placeholder={`Párrafo ${pIndex + 1}`}
                    rows={3}
                    className='flex-1'
                  />
                  {paragraphs.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeParagraph(pIndex)}
                      className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors self-start mt-2'
                      aria-label={`Eliminar párrafo ${pIndex + 1}`}
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type='button'
                onClick={addParagraph}
                className='w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 hover:border-primary-500 hover:bg-primary-50 transition-colors'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Añadir párrafo
              </button>
            </div>
          </div>

          <div className='pt-4 border-t border-border'>
            <div className='flex items-center gap-3 mb-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={showCode}
                  onChange={(e) => setShowCode(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500'
                />
                <span className='text-sm font-medium text-text-secondary'>Bloque de código</span>
              </label>
            </div>
            {showCode && (
              <TextareaInput
                value={section.code || ''}
                onChange={handleCodeChange}
                placeholder='Código de ejemplo...'
                rows={6}
                label='Código'
                className='font-mono text-sm'
              />
            )}
          </div>

          <div className='pt-4 border-t border-border'>
            <div className='flex items-center gap-3 mb-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={showImage}
                  onChange={(e) => setShowImage(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500'
                />
                <span className='text-sm font-medium text-text-secondary'>Imagen</span>
              </label>
            </div>
            {showImage && (
              <div className='space-y-3'>
                <UrlInput
                  value={section.image || ''}
                  onChange={handleImageChange}
                  placeholder='https://ejemplo.com/imagen.jpg'
                  label='URL de la imagen'
                />
                <TextInput
                  value={section.caption || ''}
                  onChange={handleCaptionChange}
                  placeholder='Pie de foto (opcional)'
                  label='Pie de foto'
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}