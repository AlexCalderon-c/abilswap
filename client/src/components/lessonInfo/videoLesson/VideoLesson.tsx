import type { Lesson } from '../../../types'

interface Props {
  lesson: Lesson
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url)
}

function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&playsinline=1`
  }
  return url
}

function getVimeoEmbedUrl(url: string): string {
  const regex = /vimeo\.com\/(\d+)/
  const match = url.match(regex)
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}?h=${match[1]}&title=0&byline=0&portrait=0`
  }
  return url
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(url)
}

function VideoLesson({ lesson }: Props) {
  const videoUrl = lesson.video_url

  if (!videoUrl) {
    return (
      <div className='flex h-full items-center justify-center bg-surface'>
        <p className='text-text-muted'>No hay video disponible para esta lección</p>
      </div>
    )
  }

  const youtubeEmbed = isYouTubeUrl(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : null
  const vimeoEmbed = isVimeoUrl(videoUrl) ? getVimeoEmbedUrl(videoUrl) : null
  const directVideo = isDirectVideoUrl(videoUrl) ? videoUrl : null

  return (
    <section className='flex h-full flex-col items-center justify-center gap-4 px-4 py-6'>
      <h1 className='text-center text-2xl md:text-3xl font-bold text-text-primary leading-tight w-full max-w-4xl'>
        {lesson.lesson_name}
      </h1>

      <div className='w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-border flex-1 min-h-0'>
        {youtubeEmbed && (
          <iframe
            src={youtubeEmbed}
            title={lesson.lesson_name}
            className='w-full h-full'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen
          />
        )}
        {vimeoEmbed && (
          <iframe
            src={vimeoEmbed}
            title={lesson.lesson_name}
            className='w-full h-full'
            frameBorder='0'
            allow='autoplay; fullscreen; picture-in-picture'
            allowFullScreen
          />
        )}
        {directVideo && (
          <video
            src={directVideo}
            className='w-full h-full object-contain'
            controls
            playsInline
            preload='metadata'
          />
        )}
        {!youtubeEmbed && !vimeoEmbed && !directVideo && (
          <div className='flex w-full h-full items-center justify-center bg-surface-secondary text-text-muted'>
            <p>Formato de video no soportado. Usa YouTube, Vimeo o archivos directos (mp4, webm, ogg).</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default VideoLesson