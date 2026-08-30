import type { Lesson } from '../../../types'

interface Props {
  lesson: Lesson
}

function TextLesson({ lesson }: Props) {

  return (
    <div className='h-full w-full overflow-hidden grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]'>
      <div className='h-full overflow-y-auto'>
        <div className='max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-12'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold'>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              Lección de texto
            </span>
            <span className='text-xs text-text-muted'>Tiempo estimado: 10 min</span>
          </div>

          <h1 className='text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-2'>
            {lesson.lesson_name}
          </h1>
          <p className='text-primary-600 font-medium mb-6'>{lesson.content?.tagline}</p>

          <p className='text-text-secondary leading-relaxed mb-8 border-l-4 border-primary-200 pl-4'>
            {lesson.content?.intro}
          </p>

          <div className='space-y-8'>
            {lesson.content?.section.map((section, index) => (
              <section key={index}>
                <h2 className='text-lg font-bold text-text-primary mb-2 flex items-center gap-2.5'>
                  <span className='w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0'>
                    {index + 1}
                  </span>
                  {section.heading}
                </h2>

                {section.paragraph.map((paragraph, i) => (
                  <p key={i} className='text-text-secondary leading-relaxed mb-3 text-[15px]'>
                    {paragraph}
                  </p>
                ))}

                {section.code && (
                  <pre className='my-4 p-5 rounded-xl bg-slate-900 text-slate-100 text-sm leading-relaxed overflow-x-auto'>
                    <code>{section.code}</code>
                  </pre>
                )}

                {section.image && (
                  <figure className='my-4 lg:hidden'>
                    <img
                      src={section.image}
                      alt={section.caption ?? section.heading}
                      loading='lazy'
                      className='w-full rounded-xl object-cover ring-1 ring-border'
                    />
                    {section.caption && (
                      <figcaption className='text-sm text-text-muted mt-1.5 italic'>
                        {section.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}

            <div className='rounded-2xl bg-primary-50/60 border border-primary-100 p-5'>
              <h3 className='font-semibold text-primary-700 mb-3 flex items-center gap-2'>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                Puntos clave
              </h3>
              <ul className='space-y-2'>
                {lesson.content?.takeaways.map((item) => (
                  <li key={item} className='flex items-start gap-2 text-sm text-primary-900'>
                    <svg className='w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/*        
      <aside className='hidden lg:block h-full overflow-hidden relative'>
        <img
          src={content.sidebar.image}
          alt={content.sidebar.title}
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20' />
        <div className='absolute inset-x-0 bottom-0 p-7 text-white'>
          <span className='inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[11px] font-semibold uppercase tracking-wider mb-3'>
            Nota de la lección
          </span>
          <h3 className='text-xl font-bold mb-2'>{content.sidebar.title}</h3>
          <p className='text-sm text-white/85 leading-relaxed mb-4'>{content.sidebar.description}</p>
          <ul className='space-y-2'>
            {content.sidebar.facts.map((fact) => (
              <li key={fact} className='flex items-center gap-2 text-sm text-white/90'>
                <svg className='w-4 h-4 text-white/70 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      */}
    </div>
  )
}

export default TextLesson
