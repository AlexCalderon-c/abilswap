import axios from "axios"

export const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry){
            originalRequest._retry = true

            try{
                await apiClient.get('api/auth/refresh')
                return apiClient(originalRequest)
            }catch(e){
                window.location.href = '/login'
                return Promise.reject(e) 
            }          
        }
    }
)