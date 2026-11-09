import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const envUrl = import.meta.env.VITE_API_BASE_URL
const isVercelHost = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
const API_BASE_URL =
  envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost')
    ? envUrl
    : isVercelHost
      ? 'https://coins-api-v2.vercel.app/api'
      : (envUrl || 'http://127.0.0.1:8000/api')

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
    // Prioritize admin token for admin routes to avoid token collision
    const isAdminReq =
      config.url?.startsWith('/admin') ||
      (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))

    const token = isAdminReq
      ? localStorage.getItem('cp_admin_token') ||
        sessionStorage.getItem('cp_admin_token') ||
        localStorage.getItem('cp_token') ||
        sessionStorage.getItem('cp_token')
      : localStorage.getItem('cp_token') ||
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
      // Clear token and user session if unauthorized
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
        localStorage.removeItem('cp_token')
        sessionStorage.removeItem('cp_token')
        localStorage.removeItem('cp_user')
        sessionStorage.removeItem('cp_user')
        localStorage.removeItem('cp_user_account_profile')
        sessionStorage.removeItem('cp_user_account_profile')
        localStorage.removeItem('cp_admin_token')
        sessionStorage.removeItem('cp_admin_token')
        localStorage.removeItem('cp_admin_user')
        sessionStorage.removeItem('cp_admin_user')
        window.dispatchEvent(new Event('cp_auth_changed'))
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
