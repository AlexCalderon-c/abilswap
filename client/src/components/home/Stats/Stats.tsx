import { useScrollAnimation } from '../../../hooks/useScrollAnimation'

const stats = [
  { icon: '🎓', value: '2,500+', label: 'Active Students' },
  { icon: '📚', value: '120+', label: 'Available Courses' },
  { icon: '👨‍🏫', value: '45+', label: 'Expert Instructors' },
  { icon: '⭐', value: '4.8/5', label: 'Average Rating' },
]

export default function Stats() {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>()

  return (
    <section ref={ref} className='py-16 md:py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8'>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center p-6 rounded-2xl bg-surface-secondary transition-all duration-500 flex justify-center gap-5 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className='text-3xl mb-3 block'>{stat.icon}</span>
              <div className='flex flex-col'>
                <p className='text-2xl md:text-3xl font-bold text-text-primary mb-1'>{stat.value}</p>
                <p className='text-sm text-text-secondary'>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
