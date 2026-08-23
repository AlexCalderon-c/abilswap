import type { Lesson } from '../../../types'

interface Props {
  lesson: Lesson
}

function ArticleLesson({ lesson }: Props) {
  return (
    <article className='h-full w-full overflow-y-auto'>
      <div className='max-w-3xl mx-auto px-6 sm:px-12 lg:px-16 py-10 md:py-12'>
        <header className='mb-10 animate-slide-up'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold'>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
              </svg>
              Artículo de lectura
            </span>
            <span className='text-xs text-text-muted'>Tiempo estimado: 8 min</span>
          </div>

          <h1 className='text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-3'>
            {lesson.lesson_name}
          </h1>
          <p className='text-lg text-primary-600 font-medium'>{lesson.content?.tagline}</p>

          <div className='mt-6 h-px bg-border' />
        </header>

        <div className='space-y-10 animate-fade-in'>
          <p className='text-lg leading-relaxed text-text-secondary first-letter:text-4xl first-letter:font-bold first-letter:text-primary-600 first-letter:mr-2 first-letter:float-left'>
            {lesson.content?.intro}
          </p>

          {lesson.content?.section.map((section, index) => (
            <section key={index}>
              <h2 className='text-xl font-bold text-text-primary mb-3 flex items-center gap-3'>
                <span className='w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center flex-shrink-0'>
                  {index + 1}
                </span>
                {section.heading}
              </h2>

              {section.image && (
                <figure className='my-6'>
                  <img
                    src={section.image}
                    alt={section.caption ?? section.heading}
                    loading='lazy'
                    className='w-full rounded-xl object-cover ring-1 ring-border shadow-sm'
                  />
                  {section.caption && (
                    <figcaption className='text-sm text-text-muted mt-2 italic'>
                      {section.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {section.code && (
                <pre className='my-6 p-5 rounded-xl bg-slate-900 text-slate-100 text-sm leading-relaxed overflow-x-auto'>
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}

          <div className='rounded-2xl bg-surface-secondary border border-border p-6'>
            <h3 className='font-semibold text-text-primary mb-3 flex items-center gap-2'>
              <svg className='w-4 h-4 text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              Ideas clave de la lección
            </h3>
            <ul className='space-y-2'>
              {lesson.content?.takeaways.map((item) => (
                <li key={item} className='flex items-start gap-2 text-sm text-text-secondary'>
                  <span className='w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleLesson
