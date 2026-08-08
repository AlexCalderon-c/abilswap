import React from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../../../types'

interface UserSidebarProps {
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  user: User | null
  onNavigate: () => void
}

const roleLabel: Record<string, string> = {
  student: 'Estudiante',
  teacher: 'Docente',
  admin: 'Administrador'
}

function UserSidebar({ handleSubmit, user, onNavigate }: UserSidebarProps) {
  const initials = (user?.username || '?').slice(0, 2).toUpperCase()

  return (
    <div className='absolute top-20 right-5 border border-border bg-white rounded-xl shadow-lg animate-slide-down overflow-hidden w-72'>
      <div className='px-4 py-5 flex items-center justify-center flex-col gap-3 bg-gradient-to-br from-surface-secondary to-surface-tertiary border-b border-border'>
        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-md'>
          {initials}
        </div>
        <div className='flex flex-col items-center'>
          <p className='font-bold text-text-primary'>{user?.username || 'Usuario'}</p>
          <span className='text-sm text-text-secondary text-center'>{user ? roleLabel[user.role] || user.role : 'Rol'}</span>
        </div>
      </div>

      <nav className='p-2 space-y-1'>
        <Link
          to='/dashboard'
          onClick={onNavigate}
          className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors'
        >
          <svg className='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-13v5h6V7h-6z' />
          </svg>
          Mi panel
        </Link>
        <Link
          to='/courses'
          onClick={onNavigate}
          className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors'
        >
          <svg className='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
          </svg>
          Explorar cursos
        </Link>
        <Link
          to='/profile'
          onClick={onNavigate}
          className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors'
        >
          <svg className='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
          </svg>
          Mi perfil
        </Link>
        {user?.role === 'teacher' ? 
          <Link
            to='/newcourse'
            onClick={onNavigate}
            className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors'
          >
            Crear cursos
          </Link>
          :
          <></>
        }
      </nav>

      <div className='border-t border-border p-2'>
        <button
          type='submit'
          onClick={handleSubmit}
          className='block w-full px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center'
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export default UserSidebar