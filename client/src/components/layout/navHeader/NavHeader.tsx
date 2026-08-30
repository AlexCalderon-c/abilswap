import React from 'react'
import { Link } from 'react-router-dom'

function NavHeader() {
  return (
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
  )
}

export default NavHeader