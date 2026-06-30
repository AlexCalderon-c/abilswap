import { useState } from 'react'
import { Link } from 'react-router-dom'


export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = () => setScrolled(window.scrollY > 20)
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          <Link to='/' className='flex items-center gap-2 group'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transition-transform group-hover:scale-105'>
              <span className='text-white font-bold text-sm'>A</span>
            </div>
            <span className='font-semibold text-xl text-text-primary'>
              Abil<span className='text-primary-600'>Swap</span>
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-3'>
            <Link
              to='/login'
              className='px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'
            >
              Iniciar sesión
            </Link>
            <Link
              to='/register'
              className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md'
            >
              Comenzar gratis
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-tertiary transition-colors'
            aria-label='Menú'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className='md:hidden border-t border-border bg-white animate-slide-down'>
          <div className='px-4 py-4 space-y-1'>
            <hr className='my-3 border-border' />
            <Link
              to='/login'
              onClick={() => setMobileOpen(false)}
              className='block px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary rounded-lg'
            >
              Iniciar sesión
            </Link>
            <Link
              to='/register'
              onClick={() => setMobileOpen(false)}
              className='block px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 text-center'
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
