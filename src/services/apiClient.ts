import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor: inject Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check user auth token or admin auth token
    const token =
      localStorage.getItem('cp_token') ||
      sessionStorage.getItem('cp_token') ||
      localStorage.getItem('cp_admin_token') ||
      sessionStorage.getItem('cp_admin_token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor: centralized error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized on a protected route
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
        localStorage.removeItem('cp_token')
        sessionStorage.removeItem('cp_token')
        localStorage.removeItem('cp_admin_token')
        sessionStorage.removeItem('cp_admin_token')
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
