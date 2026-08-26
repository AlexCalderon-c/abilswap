import { TextInput } from './BasicInputs'
import { useCallback, useRef } from 'react'
import React from 'react'

interface Props {
  takeaways: string[]
  onChange: (takeaways: string[]) => void
}

export const TakeawaysEditor = React.memo(function TakeawaysEditor({ takeaways, onChange }: Props) {
  const takeawaysRef = useRef(takeaways)
  takeawaysRef.current = takeaways

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleChange = useCallback((index: number, value: string) => {
    const newTakeaways = [...takeawaysRef.current]
    newTakeaways[index] = value
    onChangeRef.current(newTakeaways)
  }, [])

  const addTakeaway = useCallback(() => {
    onChangeRef.current([...takeawaysRef.current, ''])
  }, [])

  const removeTakeaway = useCallback((index: number) => {
    if (takeawaysRef.current.length <= 1) return
    onChangeRef.current(takeawaysRef.current.filter((_, i) => i !== index))
  }, [])

  return (
    <div className='space-y-3'>
      <label className='block text-sm font-medium text-text-secondary'>Puntos clave</label>
      <div className='space-y-2'>
        {takeaways.map((takeaway, index) => (
          <div key={index} className='flex items-start gap-3'>
            <span className='w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0' />
            <div className='flex-1 min-w-0'>
              <TextInput
                value={takeaway}
                onChange={(v) => handleChange(index, v)}
                placeholder={`Punto clave ${index + 1}`}
                className='mb-0'
              />
            </div>
            {takeaways.length > 1 && (
              <button
                type='button'
                onClick={() => removeTakeaway(index)}
                className='p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors self-start'
                aria-label={`Eliminar punto clave ${index + 1}`}
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
          onClick={addTakeaway}
          className='w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 hover:border-primary-500 hover:bg-primary-50 transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Añadir punto clave
        </button>
      </div>
    </div>
  )
})