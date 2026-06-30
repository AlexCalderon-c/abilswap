import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className='relative min-h-[90vh] flex items-center overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-200/20 via-transparent to-transparent' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='max-w-3xl'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in'>
            <span className='w-2 h-2 rounded-full bg-primary-500 animate-pulse' />
            Nueva plataforma de aprendizaje
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6 animate-slide-up'>
            Aprende
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500'>
              Programación Fullstack
            </span>
            Desde Cero
          </h1>

          <p className='text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 animate-slide-up'>
            Domina las tecnologías más demandadas con cursos prácticos creados por profesionales.
            Construye proyectos reales y acelera tu carrera en el mundo tech.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 animate-slide-up'>
            <Link
              to='/courses'
              className='px-8 py-3.5 text-center text-white font-semibold bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5'
            >
              Explorar cursos
            </Link>
            <Link
              to='/register'
              className='px-8 py-3.5 text-center text-text-primary font-semibold bg-white border-2 border-border rounded-xl hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200'
            >
              Comenzar gratis
            </Link>
          </div>

          <div className='flex items-center gap-6 mt-12 pt-8 border-t border-border/50 animate-fade-in'>
            {[
              { label: 'Estudiantes', value: '2,500+' },
              { label: 'Cursos', value: '120+' },
              { label: 'Docentes', value: '45+' },
              { label: 'Rating', value: '4.8/5' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className='text-lg font-bold text-text-primary'>{stat.value}</p>
                <p className='text-sm text-text-muted'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-full pointer-events-none'>
        <div className='relative w-full h-full'>
          <div className='absolute top-1/4 right-10 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl' />
          <div className='absolute bottom-1/4 right-20 w-96 h-96 bg-gradient-to-br from-accent-400/10 to-primary-400/10 rounded-full blur-3xl' />
          <div className='absolute top-1/3 right-16 w-64 h-64 border border-primary-200/30 rounded-2xl rotate-12 backdrop-blur-sm' />
          <div className='absolute bottom-1/3 right-32 w-48 h-48 border border-accent-200/30 rounded-2xl -rotate-6 backdrop-blur-sm' />
        </div>
      </div>
    </section>
  )
}
