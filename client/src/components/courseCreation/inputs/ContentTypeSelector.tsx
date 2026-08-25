import { CONTENT_TYPES, type ContentType } from '../../../types/courseCreation'

interface Props {
  value: ContentType
  onChange: (type: ContentType) => void
  className?: string
}

export function ContentTypeSelector({ value, onChange, className }: Props) {
  return (
    <div className={`flex gap-2 flex-wrap ${className || ''}`} role='radiogroup' aria-label='Tipo de contenido'>
      {CONTENT_TYPES.map((type) => (
        <button
          key={type.value}
          type='button'
          role='radio'
          aria-checked={value === type.value}
          onClick={() => onChange(type.value)}
          className={`
            relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 transition-all duration-200
            min-w-[110px]
            ${value === type.value
              ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
              : 'border-border bg-surface hover:border-primary-300 hover:bg-primary-50'
            }
          `}
        >
          <span className='text-3xl' aria-hidden='true'>{type.icon}</span>
          <span className={`
            text-sm font-semibold
            ${value === type.value ? 'text-primary-700' : 'text-text-secondary'}
          `}>
            {type.label}
          </span>
          {value === type.value && (
            <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-500' />
          )}
        </button>
      ))}
    </div>
  )
}

interface ContentTypeBadgeProps {
  type: ContentType
  size?: 'sm' | 'md'
}

export function ContentTypeBadge({ type, size = 'md' }: ContentTypeBadgeProps) {
  const typeInfo = CONTENT_TYPES.find((t) => t.value === type)
  if (!typeInfo) return null

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  }

  const bgColors = {
    text: 'bg-primary-50 text-primary-700 border-primary-100',
    video: 'bg-red-50 text-red-700 border-red-100',
    quiz: 'bg-amber-50 text-amber-700 border-amber-100',
    article: 'bg-green-50 text-green-700 border-green-100',
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full border font-medium ${bgColors[type]}`}>
      <span aria-hidden='true'>{typeInfo.icon}</span>
      {typeInfo.label}
    </span>
  )
}