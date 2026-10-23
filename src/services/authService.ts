import apiClient from './apiClient'

export interface UserAuthResponse {
  user: {
    id: number
    uid: string
    name: string
    display_name?: string
    full_name?: string
    email: string
    role: string
    status: string
    kyc_tier: string
    vip_level: string
    avatar_initials?: string
    country?: string
    language?: string
    time_zone?: string
    display_currency?: string
    date_format?: string
    default_dashboard_view?: string
    theme_preference?: string
    two_factor_enabled?: boolean
    notifications_config?: {
      tradeFills: boolean
      securityAlerts: boolean
      priceAlerts: boolean
      marketingNews: boolean
    }
  }
  token: string
  role?: string
  message?: string
}

export const authService = {
  async register(data: {
    fullName: string
    email: string
    password: string
    country?: string
    acceptTerms: boolean
  }): Promise<UserAuthResponse> {
    const res = await apiClient.post<UserAuthResponse>('/auth/register', data)
    if (res.data.token) {
      localStorage.setItem('cp_token', res.data.token)
      localStorage.setItem('cp_user', JSON.stringify(res.data.user))
      localStorage.removeItem('cp_user_account_profile')
      window.dispatchEvent(new Event('cp_auth_changed'))
    }
    return res.data
  },

  async login(credentials: {
    email: string
    password: string
    rememberMe?: boolean
  }): Promise<UserAuthResponse> {
    const res = await apiClient.post<UserAuthResponse>('/auth/login', credentials)
    if (res.data.token) {
      const storage = credentials.rememberMe ? localStorage : sessionStorage
      storage.setItem('cp_token', res.data.token)
      storage.setItem('cp_user', JSON.stringify(res.data.user))
      localStorage.removeItem('cp_user_account_profile')
      sessionStorage.removeItem('cp_user_account_profile')
      window.dispatchEvent(new Event('cp_auth_changed'))
    }
    return res.data
  },

  async adminLogin(credentials: {
    email: string
    password: string
  }): Promise<UserAuthResponse> {
    const res = await apiClient.post<UserAuthResponse>('/auth/admin-login', credentials)
    if (res.data.token) {
      sessionStorage.setItem('cp_admin_token', res.data.token)
      sessionStorage.setItem('cp_admin_user', JSON.stringify(res.data.user))
      sessionStorage.setItem('cp_admin_auth', 'true')
    }
    return res.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('cp_token')
      sessionStorage.removeItem('cp_token')
      localStorage.removeItem('cp_user')
      sessionStorage.removeItem('cp_user')
      localStorage.removeItem('cp_user_account_profile')
      sessionStorage.removeItem('cp_user_account_profile')
      localStorage.removeItem('cp_admin_token')
      sessionStorage.removeItem('cp_admin_user')
      sessionStorage.removeItem('cp_admin_auth')
      window.dispatchEvent(new Event('cp_auth_changed'))
    }
  },

  async getCurrentUser() {
    const res = await apiClient.get('/auth/user')
    return res.data.user
  },

  async forgotPassword(email: string) {
    const res = await apiClient.post('/auth/forgot-password', { email })
    return res.data
  },

  getStoredUser() {
    const userStr = localStorage.getItem('cp_user') || sessionStorage.getItem('cp_user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('cp_token') || sessionStorage.getItem('cp_token'))
  },

  isAdminAuthenticated(): boolean {
    return !!(sessionStorage.getItem('cp_admin_token') || sessionStorage.getItem('cp_admin_auth'))
  },
}

export default authService
