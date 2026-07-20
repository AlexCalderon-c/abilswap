import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'


export default function LoginForm() {
  const navigate = useNavigate()
  const {handleLoginAxios} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    await handleLoginAxios(e, email, password)
    navigate('/courses')
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='bg-white rounded-2xl border border-border p-8 shadow-sm'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-lg'>A</span>
          </div>
          <h1 className='text-2xl font-bold text-text-primary'>Bienvenido de vuelta</h1>
          <p className='text-sm text-text-secondary mt-2'>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-text-primary mb-1.5'>
              Correo electrónico
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='tu@correo.com'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-text-primary mb-1.5'>
              Contraseña
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
            />
          </div>

          <div className='flex items-center justify-between'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' className='w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200' />
              <span className='text-sm text-text-secondary'>Recordarme</span>
            </label>
            <a href='#' className='text-sm text-primary-600 hover:text-primary-700 transition-colors'>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type='submit'
            className='w-full py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md'
          >
            Iniciar sesión
          </button>
        </form>

        <p className='text-center text-sm text-text-secondary mt-6'>
          ¿No tienes cuenta?{' '}
          <Link to='/register' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
