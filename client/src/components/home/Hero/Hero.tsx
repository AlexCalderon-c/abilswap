import { Link } from 'react-router-dom'

export default function Hero() {

  return (
    <section className='relative min-h-[90vh] flex items-center overflow-hidden'>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='max-w-3xl flex flex-col justify-center items-center'>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6 animate-slide-up'>
            Learn
            From Scratch
          </h1>

          {/*<p className='text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 animate-slide-up'>
            Master the most in-demand technologies with practical courses created by professionals.
            Build real projects and accelerate your career in the tech world.
          </p>*/}

          <div className='flex flex-col sm:flex-row gap-4 animate-slide-up'>
            <Link
              to='/courses'
              className='px-8 py-3.5 text-center text-white font-semibold bg-primary-600 hover:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5'
            >
              Browse Courses
            </Link>
          </div> 
        </div>
      </div>
    </section>
  )
}
