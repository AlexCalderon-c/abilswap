import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Cursos', to: '/courses' },
      { label: 'Docentes', to: '/teachers' },
      { label: 'Precios', to: '/pricing' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contacto', to: '/contact' },
      { label: 'Términos', to: '/terms' },
    ],
  },
  {
    title: 'Compañía',
    links: [
      { label: 'Sobre nosotros', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Privacidad', to: '/privacy' },
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
              Plataforma de cursos de programación fullstack. Aprende con profesionales y lleva tu carrera al siguiente nivel.
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
            &copy; {new Date().getFullYear()} AbilSwap. Todos los derechos reservados.
          </p>
          <div className='flex gap-6'>
            <Link to='/terms' className='text-sm text-text-muted hover:text-text-secondary transition-colors'>
              Términos
            </Link>
            <Link to='/privacy' className='text-sm text-text-muted hover:text-text-secondary transition-colors'>
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
