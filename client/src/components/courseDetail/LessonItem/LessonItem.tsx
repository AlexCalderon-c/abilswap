import { Link } from 'react-router-dom'
import type { Lesson } from '../../../types'
import { useRouteLoaderData } from 'react-router-dom'

interface Props {
  lesson: Lesson,
  isEnrolled: boolean
}

const contentTypeIcons: Record<string, React.ReactNode> = {

  video: (
    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ),
  text: (
    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
    </svg>
  ),
  quiz: (
    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ),
  pdf: (
    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
    </svg>
  ),
}

export default function LessonItem({ lesson, isEnrolled }: Props) {

  const formatLessonTitle = (lesson: string) => {
    const lessonArr = lesson.split('')
    const newLesson = lessonArr.filter((letter) => letter !== '?' && letter !== '¿')
    const result = newLesson.join('')
    return result
  }

  const formatedTitle = formatLessonTitle(lesson.lesson_name)
  console.log('Am I enrolled: ', isEnrolled)

  return (
    
    <>
    {isEnrolled === true ? 
    <Link
      to={`/lesson/${formatedTitle}/${lesson.id}`}
      className='flex items-center justify-between px-5 py-3.5 hover:bg-surface-secondary transition-colors group'
    >
      <div className='flex items-center gap-3'>
        <span className='text-text-muted group-hover:text-primary-500 transition-colors'>
          {contentTypeIcons[lesson.content_type] || contentTypeIcons.text}
        </span>
        <div>
          <p className='text-sm text-text-primary group-hover:text-primary-600 transition-colors font-medium'>
            {lesson.lesson_name}
          </p>
          <p className='text-xs text-text-muted capitalize'>{lesson.content_type}</p>
        </div>
      </div>
      <span className='text-xs font-medium text-text-muted group-hover:text-primary-500 transition-colors'>
        {lesson.content_type === 'video' ? '15 min' : '10 min'}
      </span>
    </Link>
    : 
    <div className='flex items-center justify-between px-5 py-3.5 group'>
      <div className='flex items-center gap-3'>
        <span className='text-text-muted'>
          {contentTypeIcons[lesson.content_type] || contentTypeIcons.text}
        </span>
        <div>
          <p className='text-sm text-text-primary font-medium'>
            {lesson.lesson_name}
          </p>
          <p className='text-xs text-text-muted capitalize'>{lesson.content_type}</p>
        </div>
      </div>
      <span className='text-xs font-medium text-text-muted'>
        {lesson.content_type === 'video' ? '15 min' : '10 min'}
      </span>
    </div>
    }
    </>
  )
}
