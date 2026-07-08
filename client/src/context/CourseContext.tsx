import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Course } from '../types'
import {apiClient} from '../api/axios.ts'

interface CourseContextInterface {
    course: Course[] | undefined
    isLoading: boolean
    error: Error | null
    fetchAllCourseData: () => Promise<void> 
}

const CourseContext = createContext<CourseContextInterface | undefined>(undefined)

export function CourseProvider({children}: {children: ReactNode}){

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [course, setCourse] = useState(undefined)

    const fetchAllCourseData = useCallback(async () => {
        try{
            setIsLoading(true)
            const response = await apiClient.get('http://localhost:3001/api/course', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response){
              setCourse(response.data)               
            }

            console.log(response)
        
        }catch(e){
            setError(e as Error)
        }finally{
            setIsLoading(false)
        }
    }, [])


    const value: CourseContextInterface = {
        isLoading,
        error,
        course,
        fetchAllCourseData
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