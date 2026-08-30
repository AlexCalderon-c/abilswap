import RegisterForm from '../../components/auth/RegisterForm/RegisterForm'

export default function RegisterPage() {
  return (
    <div className='min-h-screen bg-surface-secondary flex items-center justify-center py-20'>
      <div className='w-full max-w-md px-4'>
        <RegisterForm />
      </div>
    </div>
  )
}
