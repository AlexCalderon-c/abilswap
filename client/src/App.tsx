import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import CoursesPage from './pages/CoursesPage/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import { AuthProvider } from './context/AuthContext'
import {CourseProvider} from './context/CourseContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/courses' element={<CoursesPage />} />
              <Route path='/courses/:id' element={<CourseDetailPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
          </Routes>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
