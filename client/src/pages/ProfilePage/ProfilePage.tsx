import React from 'react'

function ProfilePage() {
  return (
    <section className='min-h-screen bg-surface-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
        <div className='flex items-center justify-between mb-7'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>My Profile</h1>
          </div>
        </div>

        <nav className='min-w-full bg-blue-100 min-h-15 mb-8 flex border border-border'>
          <div className='bg-blue-100 flex items-center p-5 border-r border-border'>
            <span>Profile</span>
          </div>
          <div className='bg-blue-100 flex items-center p-5 border-r border-border'>
            <span>Account Settings</span>
          </div>
          <div className='bg-blue-100 flex items-center p-5'>
            <span>Accessibility</span>
          </div>
        </nav>

        <div className='min-w-full border border-border bg-surface'>
          <div className='min-w-full min-h-40 bg-blue-100 border-b border-border flex p-3 gap-7'>
            <div className='bg-white min-w-34 rounded-full'></div>
            <div className='flex flex-col justify-center text-2xl'>
              <span className='font-bold text-text-primary'>Username</span>
              <span className='text-[15px] text-text-secondary'>Full name | Role</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-0 p-6'>
            <div className='border border-border p-6 bg-surface-secondary'>
              <h3 className='text-lg font-semibold text-text-primary mb-3'>Account Information</h3>
              <div className='space-y-3 text-text-secondary'>
                <p><strong>Email:</strong> user@example.com</p>
                <p><strong>Member since:</strong> January 2024</p>
                <p><strong>Plan:</strong> Pro</p>
              </div>
            </div>

            <div className='border border-border p-6 bg-surface-secondary'>
              <h3 className='text-lg font-semibold text-text-primary mb-3'>Course Progress</h3>
              <div className='space-y-3 text-text-secondary'>
                <p><strong>Enrolled courses:</strong> 12</p>
                <p><strong>Completed:</strong> 8</p>
                <p><strong>In progress:</strong> 4</p>
              </div>
            </div>

            <div className='border border-border p-6 bg-surface-secondary'>
              <h3 className='text-lg font-semibold text-text-primary mb-3'>Achievements</h3>
              <div className='space-y-3 text-text-secondary'>
                <p><strong>Certificates earned:</strong> 5</p>
                <p><strong>Total hours learned:</strong> 120h</p>
                <p><strong>Current streak:</strong> 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage