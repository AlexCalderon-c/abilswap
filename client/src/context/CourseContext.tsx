import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {apiClient} from '../api/axios.ts'

interface CourseContextInterface {
    isLoading: boolean
    error: Error | null
    enrollCourse: (courseId: number) => Promise<void>
}

const CourseContext = createContext<CourseContextInterface | undefined>(undefined)

export function CourseProvider({children}: {children: ReactNode}){

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const enrollCourse = async (courseId: number) => {
        try{
            setIsLoading(true)
            const enrollBody = {
                'enrollment_status': "active"
            }
            await apiClient.post(`http://localhost:3001/api/enrollment/${courseId}`, enrollBody)
            console.log('Enrolled!')
        }catch(e){
            setError(e as Error)
        }finally{
            setIsLoading(false)
        }
    }

    const value: CourseContextInterface = {
        isLoading,
        error,
        enrollCourse
    }

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    )
} 

export function useCourse() {
    const context = useContext(CourseContext)
    if(!context) throw new Error('useContext must be within an ContextProvider')
    return context
}