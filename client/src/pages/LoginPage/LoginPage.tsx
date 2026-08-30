import LoginForm from '../../components/auth/LoginForm/LoginForm'

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-surface-secondary flex items-center justify-center py-20'>
      <div className='w-full max-w-md px-4'>
        <LoginForm />
      </div>
    </div>
  )
}
