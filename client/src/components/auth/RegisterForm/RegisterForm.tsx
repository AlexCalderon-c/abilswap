import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function RegisterForm() {

  const {handleRegisterStudentAxios, handleRegisterTeacherAxios} = useAuth()


  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(role === 'student'){
      handleRegisterStudentAxios(e, name, username, email, password)
    }
    if(role === 'teacher'){
      handleRegisterTeacherAxios(e, name, username, email, password)
    }
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='bg-white rounded-2xl border border-border p-8 shadow-sm'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-lg'>A</span>
          </div>
          <h1 className='text-2xl font-bold text-text-primary'>Create Your Account</h1>
          <p className='text-sm text-text-secondary mt-2'>Start your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-text-primary mb-1.5'>
              Full Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
            />
          </div>

          <div>
            <label htmlFor='username' className='block text-sm font-medium text-text-primary mb-1.5'>
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Your username'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
            />
          </div>


          <div>
            <label htmlFor='email' className='block text-sm font-medium text-text-primary mb-1.5'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@email.com'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-text-primary mb-1.5'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Minimum 8 characters'
              className='w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all'
              required
              minLength={8}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>Account Type</label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setRole('student')}
                className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                  role === 'student'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border text-text-secondary hover:border-primary-200'
                }`}
              >
                Student
              </button>
              <button
                type='button'
                onClick={() => setRole('teacher')}
                className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                  role === 'teacher'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border text-text-secondary hover:border-primary-200'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md'
          >
            Create Account
          </button>
        </form>

        <p className='text-center text-sm text-text-secondary mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
