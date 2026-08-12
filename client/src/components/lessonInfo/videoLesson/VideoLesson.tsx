import type { Lesson } from '../../../types'
import { getLessonContent } from '../lessonData/mockContent'

interface Props {
  lesson: Lesson
}

const MOCK_VIDEO_SOURCES = [
  { src: 'https://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video/mp4' },
  { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video/mp4' },
]

const MOCK_POSTER = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'

function getVideoType(url: string): string {
  if (/\.webm/i.test(url)) return 'video/webm'
  if (/\.(ogg|ogv)/i.test(url)) return 'video/ogg'
  return 'video/mp4'
}

function getPlayableSource(url?: string): string | null {
  if (!url) return null
  // La etiqueta <video> solo puede reproducir archivos directos.
  // URLs como YouTube/Vimeo o sin extensión no son reproducibles aquí.
  if (/\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(url)) return url
  return null
}

function VideoLesson({ lesson }: Props) {
  const content = getLessonContent(lesson)
  const source = getPlayableSource(lesson.video_url)
  const usesMock = !source

  const sources = usesMock
    ? MOCK_VIDEO_SOURCES
    : [{ src: source as string, type: getVideoType(source as string) }]

  return (
    <section className='h-full w-full overflow-y-auto flex flex-col items-center justify-center gap-8 px-6 py-10'>
      <div className='w-full max-w-4xl animate-slide-up'>
        <div className='flex items-center gap-2 mb-3'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold'>
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            Lección en video
          </span>
          <span className='text-xs text-text-muted'>
            {lesson.duration ?? '15 min'}
          </span>
        </div>

        <h1 className='text-2xl md:text-3xl font-bold text-text-primary leading-tight'>
          {content.title}
        </h1>
        <p className='text-text-secondary mt-2 max-w-2xl'>{content.tagline}</p>
      </div>

      <div className='w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg ring-1 ring-border bg-surface animate-fade-in'>
        <video
          className='w-full aspect-video bg-black'
          controls
          playsInline
          preload='metadata'
          width='640'
          height='480'
          poster={usesMock ? MOCK_POSTER : undefined}
        >
          {sources.map((videoSource) => (
            <source key={videoSource.src} src={videoSource.src} type={videoSource.type} />
          ))}
          Tu navegador no soporta la reproducción de video.
        </video>

        {usesMock && (
          <div className='px-4 py-2.5 bg-surface-secondary border-t border-border text-xs text-text-muted'>
            Video de demostración: agrega un video_url directo (mp4/webm) a esta lección para reemplazarlo.
          </div>
        )}
      </div>

      {/*<div className='w-full max-w-4xl space-y-6 animate-slide-up'>
        <div className='rounded-2xl bg-surface-secondary border border-border p-6'>
          <h2 className='font-semibold text-text-primary mb-2'>Acerca de esta lección</h2>
          <p className='text-text-secondary leading-relaxed'>{content.intro}</p>
        </div>

        <div className='rounded-2xl bg-primary-50/60 border border-primary-100 p-6'>
          <h3 className='font-semibold text-primary-700 mb-3 flex items-center gap-2'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            Puntos clave
          </h3>
          <ul className='grid sm:grid-cols-2 gap-2.5'>
            {content.takeaways.map((item) => (
              <li key={item} className='flex items-start gap-2 text-sm text-primary-900'>
                <svg className='w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>*/}
    </section>
  )
}

export default VideoLesson
