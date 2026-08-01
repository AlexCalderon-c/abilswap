import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import UserSidebar from '../userSidebar/UserSidebar'

function UserHeader() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const {userState, handleLogout} = useAuth()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      await handleLogout()
      navigate('/login')
    }
    console.log(userState)

  return ( 
    <>
        <div className='flex gap-6 items-center'>
            <span className='font-bold'>Hello, {userState?.username}</span>
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
        {menuOpen && (<UserSidebar handleSubmit={handleSubmit}/>)}
    </>   
    
  )
}

export default UserHeader