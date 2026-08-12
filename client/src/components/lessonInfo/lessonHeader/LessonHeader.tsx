import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import NavHeader from '../../layout/navHeader/NavHeader'
import UserHeader from '../../layout/userHeader/UserHeader'


function LessonHeader() {
  const {isAuthenticatedState} = useAuth()  
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

          {!isAuthenticatedState ? <NavHeader/> : <UserHeader/>}
          
        </div>
      </div>
    </header>
  )
}

export default LessonHeader