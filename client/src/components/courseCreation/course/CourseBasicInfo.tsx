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
          <h3 className='text-lg font-semibold text-primary-800'>Course Information</h3>
          <p className='text-sm text-primary-700'>Configure the basic details of your course</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <TextInput
          value={data.course_name}
          onChange={(v) => updateData('course_name', v)}
          placeholder='E.g., Introduction to React'
          label='Course Name *'
          error={errors?.course_name}
          className='md:col-span-2'
        />

        <TextareaInput
          value={data.description}
          onChange={(v) => updateData('description', v)}
          placeholder='Describe what students will learn, prerequisites, what the course includes...'
          label='Description *'
          error={errors?.description}
          rows={5}
          className='md:col-span-2'
        />

        <NumberInput
          value={String(data.price)}
          onChange={(v) => updateData('price', parseFloat(v) || 0)}
          placeholder='0.00'
          label='Price ($) *'
          error={errors?.price}
          min={0}
          step='0.01'
        />

        <SelectInput
          value={data.category}
          onChange={(v) => updateData('category', v)}
          label='Category'
          error={errors?.category}
          options={[
            { value: 'programming', label: 'Programming' },
            { value: 'design', label: 'Design' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'business', label: 'Business' },
            { value: 'data-science', label: 'Data Science' },
            { value: 'devops', label: 'DevOps' },
            { value: 'mobile', label: 'Mobile Development' },
            { value: 'other', label: 'Other' },
          ]}
        />

        <UrlInput
          value={data.image_url}
          onChange={(v) => updateData('image_url', v)}
          placeholder='https://example.com/image.jpg'
          label='Cover Image URL'
          error={errors?.image_url}
        />
      </div>
    </div>
  )
}