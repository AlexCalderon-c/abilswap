import Hero from '../../components/home/Hero/Hero'
import Stats from '../../components/home/Stats/Stats'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <section className='py-20 md:py-28 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-text-primary mb-4'>
            ¿Listo para comenzar?
          </h2>
          <p className='text-lg text-text-secondary max-w-xl mx-auto mb-8'>
            Únete a miles de estudiantes que ya están aprendiendo y transformando su carrera profesional.
          </p>
          <a
            href='/register'
            className='inline-flex px-8 py-3.5 text-white font-semibold bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5'
          >
            Crear cuenta gratis
          </a>
        </div>
      </section>
    </>
  )
}
