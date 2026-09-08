import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Courses', to: '/courses' },
      { label: 'Teachers', to: '/teachers' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
      { label: 'Terms', to: '/terms' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Privacy', to: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className='bg-white border-t border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div className='col-span-2 md:col-span-1'>
            <Link to='/' className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>A</span>
              </div>
              <span className='font-semibold text-xl text-text-primary'>
                Abil<span className='text-primary-600'>Swap</span>
              </span>
            </Link>
            <p className='text-sm text-text-secondary leading-relaxed mb-4'>
              Fullstack programming course platform. Learn from professionals and take your career to the next level.
            </p>
            
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className='font-semibold text-sm text-text-primary mb-4'>{group.title}</h3>
              <ul className='space-y-3'>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className='text-sm text-text-secondary hover:text-primary-600 transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-text-muted'>
            &copy; {new Date().getFullYear()} AbilSwap. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link to='/terms' className='text-sm text-text-muted hover:text-text-secondary transition-colors'>
              Terms
            </Link>
            <Link to='/privacy' className='text-sm text-text-muted hover:text-text-secondary transition-colors'>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
