import React from 'react'

function ProfilePage() {
  return (
    <section className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='flex items-center justify-between mb-7'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>My Profile</h1>
          </div>
          <a href='/courses' className='hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all'>Browse Courses</a>
        </div>

        <nav className='min-w-full bg-blue-100 min-h-15 mb-8 flex'>
          <div className='bg-blue-100 flex items-center p-5'>
            <span>Profile</span>
          </div>
          <div className='bg-blue-100 flex items-center p-5'>
            <span>Account Settings</span>
          </div>
          <div className='bg-blue-100 flex items-center p-5'>
            <span>Accesibility</span>
          </div>
        </nav>

        <div className='min-w-full border min-h-screen'>
          {/*User Info */}
          <div className='min-w-full min-h-40 bg-blue-100 border-b flex p-3 gap-7'>
            <div className='bg-white min-w-34 rounded-full'>

            </div>
            <div className='flex flex-col justify-center text-2xl'>
              <span>Username</span>
              <span className='text-[15px]'>Full name | Role</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage