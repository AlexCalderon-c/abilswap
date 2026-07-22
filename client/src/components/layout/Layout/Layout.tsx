import { Outlet, useRouteLoaderData } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { AuthProvider } from '../../../context/AuthContext'

export default function Layout() {

  const data = useRouteLoaderData('auth')
  return (
    <AuthProvider loadedData={data}>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-1 pt-16 md:pt-20'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
