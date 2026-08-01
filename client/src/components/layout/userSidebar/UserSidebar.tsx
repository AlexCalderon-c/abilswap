import React from 'react'

function UserSidebar({handleSubmit}: {handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>}) {
  return (
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
  )
}

export default UserSidebar