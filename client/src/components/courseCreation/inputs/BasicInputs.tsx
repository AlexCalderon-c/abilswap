import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function TextInput({ value, onChange, placeholder, label, error, disabled, className }: Props) {
  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-text-secondary mb-1.5'>{label}</label>
      )}
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200
          bg-surface text-text-primary placeholder-text-muted
          border-${error ? 'red-300' : 'border'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-base
        `}
      />
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  )
}

export function TextareaInput({ value, onChange, placeholder, label, error, disabled, className, rows = 4, autoResize = true }: Props & { rows?: number; autoResize?: boolean }) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, autoResize])

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-text-secondary mb-1.5'>{label}</label>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200
          bg-surface text-text-primary placeholder-text-muted resize-none
          border-${error ? 'red-300' : 'border'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-base leading-relaxed font-sans
        `}
      />
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  )
}

export function NumberInput({ value, onChange, placeholder, label, error, disabled, className, min, max, step = '0.01' }: Props & { min?: number; max?: number; step?: string }) {
  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-text-secondary mb-1.5'>{label}</label>
      )}
      <input
        type='number'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200
          bg-surface text-text-primary placeholder-text-muted
          border-${error ? 'red-300' : 'border'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-base
        `}
      />
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
}

interface SelectInputProps extends Omit<Props, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}

export function SelectInput({ value, onChange, placeholder, label, error, disabled, className, options }: SelectInputProps) {
  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-text-secondary mb-1.5'>{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200
          bg-surface text-text-primary
          border-${error ? 'red-300' : 'border'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-base appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]_right-3_center_no-repeat
          pr-10
        `}
      >
        {placeholder && <option value='' disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  )
}

interface UrlInputProps extends Props {
  onPaste?: (url: string) => void
}

export function UrlInput({ value, onChange, placeholder, label, error, disabled, className, onPaste }: UrlInputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData('text').trim()
    if (onPaste) onPaste(pastedUrl)
  }

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-text-secondary mb-1.5'>{label}</label>
      )}
      <div className='relative'>
        <input
          type='url'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            bg-surface text-text-primary placeholder-text-muted
            border-${error ? 'red-300' : 'border'}
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            text-base pr-12
          `}
        />
        {value && (
          <button
            type='button'
            onClick={() => onChange('')}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors'
            aria-label='Limpiar'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  )
}