import { TextContentEditor } from './TextContentEditor'
import { type LessonContentFormData } from '../../../types/courseCreation'

interface Props {
  content: LessonContentFormData
  onChange: (content: LessonContentFormData) => void
}

export function ArticleContentEditor({ content, onChange }: Props) {
  return (
    <div className='space-y-6'>
      <div className='bg-green-50 border border-green-100 rounded-2xl p-5 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
            </svg>
          </div>
          <div>
            <h4 className='font-semibold text-green-800'>Modo Artículo</h4>
            <p className='text-sm text-green-700'>Diseñado para contenido de lectura larga con formato elegante</p>
          </div>
        </div>
      </div>
      <TextContentEditor content={content} onChange={onChange} />
    </div>
  )
}