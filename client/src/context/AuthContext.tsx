import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'
import {apiClient} from '../api/axios.ts'
import type { AxiosResponse } from 'axios'

interface AuthContextType {
  userState: User | null
  isAuthenticatedState: boolean
  handleLogout: () => Promise<AxiosResponse<any, any, {}> | undefined>
  handleLoginAxios: (e: React.SubmitEvent<HTMLFormElement>, userEmail: string, userPassword: string) => Promise<AxiosResponse<any, any, {}> | undefined>
  handleRegisterStudentAxios: (e: React.SubmitEvent<HTMLFormElement>, fullname: string, username: string, email: string, password: string, bio?: string, profile_pic?: string) => void
  handleRegisterTeacherAxios: (e: React.SubmitEvent<HTMLFormElement>, fullname: string, username: string, email: string, password: string, bio?: string, profile_pic?: string) => void
}

interface LoadedDataType {
  user: User
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, loadedData }: { children: ReactNode, loadedData: LoadedDataType }) {
  const {user, isAuthenticated} = loadedData
  console.log("FROM CONTEXT: ",loadedData)
  const [userState, setUserState] = useState<User | null>(user)
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean>(isAuthenticated)

  const handleLoginAxios = async (e: React.SubmitEvent<HTMLFormElement>, email: string, password: string) => {
    e.preventDefault()

    const userBody = JSON.stringify({
      email, 
      password
    })

    try{
      const response = await apiClient.post('http://localhost:3001/api/auth/login', userBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(response.data)

      if(response){
        setUserState(response.data)
        setIsAuthenticatedState(true)
        return response
      }
    }catch(e){
      console.log(e)
    }
  }

  const handleRegisterStudentAxios = async (e: React.SubmitEvent<HTMLFormElement>, full_name: string, username: string, email: string, password: string, bio?: string, profile_pic?: string) => {
    e.preventDefault()
    const userBody = JSON.stringify({
        full_name,
        username,
        email,
        password,
        bio,
        profile_pic
      })
    
    try{
      
      const response = await apiClient.post('http://localhost:3001/api/auth/register/student', userBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response)
    }catch(e){
      console.log(e)
    }
  }

  const handleRegisterTeacherAxios = async (e: React.SubmitEvent<HTMLFormElement>, full_name: string, username: string, email: string, password: string, bio?: string, profile_pic?: string) => {
    e.preventDefault()
    const userBody = JSON.stringify({
        full_name,
        username,
        email,
        password,
        bio,
        profile_pic
      })

    try{
      
      const response = await apiClient.post('http://localhost:3001/api/auth/register/teacher', userBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response)
    }catch(e){
      console.log(e)
    }
  }

  const handleLogout = async () => {

    const response = await apiClient.delete('http://localhost:3001/api/auth/logout', {
        headers: {
          'Content-Type': 'application/json'
        }
    })

    if(response){
      setUserState(null)
      setIsAuthenticatedState(false)
      return response
    }
  }

  const value: AuthContextType = {
    userState,
    isAuthenticatedState,
    handleLoginAxios,
    handleLogout,
    handleRegisterStudentAxios,
    handleRegisterTeacherAxios
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
