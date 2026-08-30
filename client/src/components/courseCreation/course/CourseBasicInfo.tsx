import { TextInput, TextareaInput, NumberInput, UrlInput, SelectInput } from '../inputs/BasicInputs'
import { type CourseFormData } from '../../../types/courseCreation'

interface Props {
  data: CourseFormData
  onChange: (data: CourseFormData) => void
  errors?: Partial<Record<keyof CourseFormData, string>>
}

export function CourseBasicInfo({ data, onChange, errors }: Props) {
  const updateData = (field: keyof CourseFormData, value: string | number) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-2xl'>
        <div className='w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0'>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
          </svg>
        </div>
        <div>
          <h3 className='text-lg font-semibold text-primary-800'>Información del curso</h3>
          <p className='text-sm text-primary-700'>Configura los datos básicos de tu curso</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <TextInput
          value={data.course_name}
          onChange={(v) => updateData('course_name', v)}
          placeholder='Ej: Introducción a React'
          label='Nombre del curso *'
          error={errors?.course_name}
          className='md:col-span-2'
        />

        <TextareaInput
          value={data.description}
          onChange={(v) => updateData('description', v)}
          placeholder='Describe qué aprenderán los estudiantes, requisitos previos, qué incluye el curso...'
          label='Descripción *'
          error={errors?.description}
          rows={5}
          className='md:col-span-2'
        />

        <NumberInput
          value={String(data.price)}
          onChange={(v) => updateData('price', parseFloat(v) || 0)}
          placeholder='0.00'
          label='Precio (€) *'
          error={errors?.price}
          min={0}
          step='0.01'
        />

        <SelectInput
          value={data.category}
          onChange={(v) => updateData('category', v)}
          label='Categoría'
          error={errors?.category}
          options={[
            { value: 'programming', label: 'Programación' },
            { value: 'design', label: 'Diseño' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'business', label: 'Negocios' },
            { value: 'data-science', label: 'Ciencia de datos' },
            { value: 'devops', label: 'DevOps' },
            { value: 'mobile', label: 'Desarrollo móvil' },
            { value: 'other', label: 'Otros' },
          ]}
        />

        <UrlInput
          value={data.image_url}
          onChange={(v) => updateData('image_url', v)}
          placeholder='https://ejemplo.com/imagen.jpg'
          label='URL de la imagen de portada'
          error={errors?.image_url}
        />
      </div>
    </div>
  )
}