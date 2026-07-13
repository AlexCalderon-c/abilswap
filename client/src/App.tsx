import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/layout/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import CoursesPage from './pages/CoursesPage/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import { AuthProvider } from './context/AuthContext'
import {CourseProvider} from './context/CourseContext'
import { apiClient } from './api/axios'


export default function App() {
  const courseLoader = async () => {
    const [courses, categories] = await Promise.all([apiClient.get('http://localhost:3001/api/course').then(res => res.data), apiClient.get('http://localhost:3001/api/course/category').then(res => res.data)])
    console.log(courses)
    console.log(categories)
    return {courses, categories}
  }
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/courses' element={<CoursesPage />} loader={courseLoader} />
        <Route path='/courses/:id' element={<CourseDetailPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Route>
    </>
  ))
  return (
    
      <AuthProvider>
        <CourseProvider>
          <RouterProvider router = {router}/>
        </CourseProvider>
      </AuthProvider>
  )
}
