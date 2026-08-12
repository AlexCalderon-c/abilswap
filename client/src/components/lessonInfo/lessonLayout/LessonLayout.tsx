import { Outlet, useRouteLoaderData } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import LessonHeader from '../lessonHeader/LessonHeader'
import LessonFooter from '../lessonFooter/LessonFooter'


function LessonLayout() {
  const data = useRouteLoaderData('auth')
  return (
    <AuthProvider loadedData={data}>
        <LessonHeader/>
        <main className='h-lvh w-lvw flex justify-center pt-16 md:pt-20 pb-20 overflow-hidden'>
          <Outlet />
        </main>
        <LessonFooter/>
    </AuthProvider>
  )
}

export default LessonLayout