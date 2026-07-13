import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'

const categories = ['Todas', 'Fullstack', 'Frontend', 'Backend', 'DevOps', 'Mobile']
const sortOptions = [
  { value: 'popular', label: 'Más populares' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
]

interface Props {
  onSearch: (value: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
}

export default function CourseFilters({ onSearch, onCategoryChange, onSortChange }: Props) {
  const loadedData = useLoaderData()
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [categories, setCategories] = useState(loadedData.category)

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <svg
          className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
        <input
          type='text'
          placeholder='Buscar cursos...'
          onChange={(e) => onSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
        />
      </div>

      <div className='flex flex-wrap gap-2'>
        {loadedData.categories.map((obj: {category: string}, index: number) => (
          <button
            key={index}
            onClick={() => {
              setActiveCategory(obj.category)
              onCategoryChange(obj.category)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeCategory === obj.category
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-surface-tertiary text-text-secondary hover:bg-border'
            }`}
          >
            {obj.category}
          </button>
        ))}
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-sm text-text-muted'>Ordenar por:</span>
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className='px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all'
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
