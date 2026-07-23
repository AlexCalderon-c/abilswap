import axios, { type AxiosResponse } from "axios"

const ENDPOINTS_ARR = ['/api/auth/refresh']

export const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})

let refreshPromise: Promise<any> | null = null

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if(ENDPOINTS_ARR.some(endpoint => originalRequest.url?.includes(endpoint))){
            console.log(originalRequest)
            return Promise.reject(error)
        }

        if((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry){
            originalRequest._retry = true

                if(!refreshPromise){
                    refreshPromise = apiClient.get('api/auth/refresh', {
                    _retry: true //ESTO NECESITA DE UN TIPO EN TYPESCRIPT CUSTOM
                    })
                    .finally(() => {refreshPromise = null})
                }

            try{               
                await refreshPromise
                return apiClient(originalRequest)
            }catch(e){
                if(window.location.pathname !== '/login'){
                    window.location.href = '/login'
                }                
                return Promise.reject(e) 
            }          
        }

        return Promise.reject(error)
    }
)