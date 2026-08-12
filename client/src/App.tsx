import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/layout/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import CoursesPage from './pages/CoursesPage/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import CreateCoursePage from './pages/CreateCoursePage/CreateCoursePage'
import InfoLessonPage from './pages/InfoLessonPage/InfoLessonPage'
import {CourseProvider} from './context/CourseContext'
import { apiClient } from './api/axios'
import type { LoaderFunctionArgs } from 'react-router-dom'
import LessonLayout from './components/lessonInfo/lessonLayout/LessonLayout'

const lessonLoader = async ({params}: LoaderFunctionArgs) => {
  const lesson = await apiClient.get(`http://localhost:3001/api/lesson/${params.lesson_id}`)
  return lesson.data
}

const dashboardLoader = async () => {
  const dashboard = await apiClient.get('http://localhost:3001/api/enrollment/dashboard')
  console.log(dashboard)
  return dashboard.data
}

const courseLoader = async () => {
    const [courses, categories] = await Promise.all([apiClient.get('http://localhost:3001/api/course').then(res => res.data), apiClient.get('http://localhost:3001/api/course/category').then(res => res.data)])
    console.log(courses)
    console.log(categories)
    return {courses, categories}
}

const detailedCourseLoader = async ({params}: LoaderFunctionArgs) => {
  const [courses, modules, enroll] = await Promise.all([
    apiClient.get(`http://localhost:3001/api/course/courseinfo/${params.course_id}`).then(res => res.data), 
    apiClient.get(`http://localhost:3001/api/module/moduleinfo/${params.course_id}`).then(res => res.data),
    apiClient.get(`http://localhost:3001/api/enrollment/courseinfo/${params.course_id}`).then(res => res.data).catch(() => false)]) 
  return {courses, modules, enroll}
}

const authLoader = async () => {
  try{
    const response = await apiClient.get('http://localhost:3001/api/user/me')
    console.log("loaded auth")
    return {user: response.data, isAuthenticated: true}
  }catch(e){
    console.log('Failed auth check: ', e)
    return {user: null, isAuthenticated: false} 
  }  
}

const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route loader={authLoader} id='auth'>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/courses' element={<CoursesPage />} loader={courseLoader}/>
          <Route path='/courses/:course_id' element={<CourseDetailPage />} loader={detailedCourseLoader}/>
          <Route path='/login' element={<LoginPage />}  />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard/' element={<DashboardPage />} loader={dashboardLoader}/>
          <Route path='/newcourse/' element={<CreateCoursePage />}/>          
        </Route>
        <Route element={<LessonLayout/>}>
          <Route path='/lesson/:lesson_name/:lesson_id' element={<InfoLessonPage />} loader={lessonLoader}/> 
        </Route>
      </Route>
    </>
))

export default function App() { 
  return (
      <CourseProvider>
        <RouterProvider router = {router}/>
      </CourseProvider>
  )
}
