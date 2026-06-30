interface Props {
  progress: number
}

export default function ProgressBar({ progress }: Props) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div>
      <div className='flex items-center justify-between mb-1.5'>
        <span className='text-xs font-medium text-text-secondary'>Progreso</span>
        <span className='text-xs font-medium text-text-secondary'>{Math.round(clampedProgress)}%</span>
      </div>
      <div className='w-full h-2 rounded-full bg-surface-tertiary overflow-hidden'>
        <div
          className='h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 ease-out'
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
