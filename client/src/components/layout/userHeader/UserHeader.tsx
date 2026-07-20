import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

function UserHeader() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const {handleLogout} = useAuth()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    await handleLogout()
    navigate('/courses')
  }

  return ( 
    <>
        <div className='flex gap-6 items-center'>
            <span className='font-bold'>Hello, user</span>
            <button
            
                onClick={() => setMenuOpen(!menuOpen)}
                className='p-2 rounded-lg text-text-secondary hover:bg-surface-tertiary transition-colors'
                aria-label='Menú'
            >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    {menuOpen ? (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    ) : (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                    )}
                </svg>
            </button>
        </div>
        {menuOpen && (
        <div className='absolute top-20 right-5 border-t border-border bg-white animate-slide-down'>
          <div className='px-4 py-4 space-y-1'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='block px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 text-center'
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </>   
    
  )
}

export default UserHeader