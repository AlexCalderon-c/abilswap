import { Link } from 'react-router-dom'

export default function Hero() {

  return (
    <section className='relative min-h-[90vh] flex items-center overflow-hidden bg-[#0006] z-40'>
      <div className='min-h-[90vh] min-w-full absolute bg-white z-0 flex overflow-x-scroll scrollbar-hide'>
        <div className='w-full flex justify-center items-center gap-1 animate-carousel'>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/fq0P4EU.jpeg)] bg-size-[100%]'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/uiFpgtx.jpeg)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/aCNxbKK.png)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/coqU8CN.jpeg)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/TZbY0L8.jpeg)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/8RWakoY.jpeg)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/arxOLGx.jpeg)] bg-cover'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1 bg-[url(https://i.imgur.com/bRuXUEL.jpeg)] bg-cover center'>
          
          </div>
          <div className='min-h-full min-w-100 bg-white w-[15%] z-1bg-[url(https://i.imgur.com/fq0P4EU.jpeg)] bg-cover'>
          
          </div>
        </div>
      </div>
      <div className='absolute inset-0 z-1 bg-black/40 pointer-events-none' />
      <div className='relative z-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        
        <div className='max-w-3xl flex flex-col justify-center items-center'>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 animate-slide-up'>
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
              className='px-8 py-3.5 text-center text-white font-semibold bg-primary-600 hover:bg-primary-700 transition-all duration-200  hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5'
            >
              Get started
            </Link>
          </div> 
        </div>
      </div>
    </section>
  )
}
