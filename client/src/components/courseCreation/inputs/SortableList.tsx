import React, { useState, useRef } from 'react'

interface SortableItem<T> {
  id: string
  data: T
}

interface SortableListProps<T> {
  items: SortableItem<T>[]
  onReorder: (items: SortableItem<T>[]) => void
  renderItem: (item: SortableItem<T>, index: number, isDragging: boolean) => React.ReactNode
  placeholder?: React.ReactNode
  className?: string
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  placeholder,
  className,
}: SortableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  console.log('Hola')

  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    e.currentTarget.classList.remove('opacity-50')
  }

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (index !== draggedIndex) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    onReorder(newItems)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null)
    }
  }

  return (
    <div className={`space-y-3 ${className || ''}`} role='list' aria-label='Lista ordenable'>
      {items.map((item, index) => {
        const isDragging = draggedIndex === index
        const isDragOver = dragOverIndex === index && draggedIndex !== index

        return (
          <div
            key={item.id}
            ref={(el) => { itemsRef.current[index] = el! }}
            draggable
            onDragStart={(e) => handleDragStart(index, e)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={() => handleDrop(index)}
            onDragLeave={handleDragLeave}
            className={`
              relative transition-all duration-200
              ${isDragging ? 'opacity-50 rotate-1 shadow-xl z-10' : ''}
              ${isDragOver ? 'ring-2 ring-primary-500 ring-offset-2 -translate-y-1' : ''}
            `}
            role='listitem'
            aria-grabbed={isDragging}
          >
            <div className='absolute -left-10 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing transition-colors' aria-hidden='true'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8h16M4 16h16M4 12h16' />
              </svg>
            </div>
            {renderItem(item, index, isDragging)}
          </div>
        )
      })}
      {draggedIndex !== null && placeholder && (
        <div className='animate-pulse'>{placeholder}</div>
      )}
    </div>
  )
}