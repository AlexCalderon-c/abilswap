import axios from "axios"

export const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if(error.response?.status === 403 && !originalRequest._retry){
            originalRequest._retry = true

            const response = await apiClient.get('http://localhost:3001/api/auth/refresh')

           
        }
    }
)