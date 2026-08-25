import { useState } from 'react'
import { UrlInput } from './BasicInputs'

interface Props {
  videoUrl: string
  onChange: (url: string) => void
}

export function VideoContentEditor({ videoUrl, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  const validateAndPreview = (url: string) => {
    onChange(url)
    setUrlError(null)
    setPreviewUrl(null)
    setIsValidUrl(false)

    if (!url.trim()) return

    try {
      new URL(url)
      const isYouTube = /youtube\.com|youtu\.be/.test(url)
      const isVimeo = /vimeo\.com/.test(url)
      const isDirect = /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(url)

      if (isYouTube || isVimeo || isDirect) {
        setIsValidUrl(true)
        setPreviewUrl(url)
      } else {
        setUrlError('URL no soportada. Usa YouTube, Vimeo o enlaces directos a video (mp4, webm, ogg, mov)')
      }
    } catch {
      setUrlError('URL inválida')
    }
  }

  const getEmbedUrl = (url: string): string | null => {
    if (/youtube\.com|youtu\.be/.test(url)) {
      const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      const match = url.match(regex)
      return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&playsinline=1` : null
    }
    if (/vimeo\.com/.test(url)) {
      const regex = /vimeo\.com\/(\d+)/
      const match = url.match(regex)
      return match ? `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0` : null
    }
    if (/\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(url)) {
      return url
    }
    return null
  }

  const embedUrl = previewUrl ? getEmbedUrl(previewUrl) : null

  return (
    <div className='space-y-6'>
      <div className='bg-surface-secondary border border-border rounded-2xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center'>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z' />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-text-primary'>Enlace de video</h3>
            <p className='text-sm text-text-muted'>YouTube, Vimeo o enlace directo (mp4, webm, ogg, mov)</p>
          </div>
        </div>

        <UrlInput
          value={videoUrl}
          onChange={validateAndPreview}
          placeholder='https://youtube.com/watch?v=... o https://vimeo.com/...'
          label='URL del video'
          error={urlError || undefined}
        />

        {isValidUrl && (
          <div className='mt-4 p-4 bg-surface rounded-xl border border-border'>
            <p className='text-sm font-medium text-text-secondary mb-3'>Vista previa:</p>
            <div className='aspect-video rounded-lg overflow-hidden bg-black'>
              {embedUrl && previewUrl && /youtube\.com|youtu\.be/.test(previewUrl) && (
                <iframe
                  src={embedUrl}
                  title='Vista previa del video'
                  className='w-full h-full'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              )}
              {embedUrl && previewUrl && /vimeo\.com/.test(previewUrl) && (
                <iframe
                  src={embedUrl}
                  title='Vista previa del video'
                  className='w-full h-full'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                />
              )}
              {embedUrl && previewUrl && /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(previewUrl) && (
                <video
                  src={embedUrl}
                  className='w-full h-full object-contain'
                  controls
                  playsInline
                  preload='metadata'
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className='bg-primary-50 border border-primary-100 rounded-2xl p-5'>
        <h4 className='font-semibold text-primary-700 mb-3 flex items-center gap-2'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          Consejos
        </h4>
        <ul className='space-y-2 text-sm text-primary-900'>
          <li className='flex items-start gap-2'>
            <svg className='w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Usa URLs de YouTube o Vimeo para mejor compatibilidad
          </li>
          <li className='flex items-start gap-2'>
            <svg className='w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Para archivos directos, asegúrate de que el servidor permita CORS
          </li>
          <li className='flex items-start gap-2'>
            <svg className='w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Los videos de YouTube deben ser públicos o no listados
          </li>
        </ul>
      </div>
    </div>
  )
}