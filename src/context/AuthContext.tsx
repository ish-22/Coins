import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService, accountService } from '@/services'
import { UserAccountProfile, DEFAULT_USER_PROFILE } from '@/mock/accountData'

export interface AuthUser extends UserAccountProfile {
  id?: number
  name?: string
  role?: string
  twoFactorEnabled?: boolean
  // snake_case aliases for compatibility with backend models
  display_name?: string
  full_name?: string
  avatar_initials?: string
  kyc_tier?: string
  vip_level?: string
  time_zone?: string
  display_currency?: string
  date_format?: string
  default_dashboard_view?: string
  theme_preference?: string
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  refreshUser: () => Promise<void>
  updateUser: (profile: Partial<UserAccountProfile>) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeUser(raw: any): AuthUser {
  if (!raw) return DEFAULT_USER_PROFILE

  const fullName = raw.fullName || raw.full_name || raw.name || 'User'
  const displayName = raw.displayName || raw.display_name || fullName
  const nameParts = fullName.trim().split(' ')
  const fallbackInitials = (
    (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || nameParts[0]?.[1] || '')
  ).toUpperCase() || 'CP'

  const avatarInitials = raw.avatarInitials || raw.avatar_initials || fallbackInitials
  const vipLevel = raw.vipLevel || raw.vip_level || 'VIP 1'
  const verificationTier = raw.verificationTier || raw.kyc_tier || 'Tier 0'

  return {
    id: raw.id,
    uid: raw.uid || 'UID-000000',
    name: fullName,
    displayName,
    fullName,
    email: raw.email || '',
    phone: raw.phone || '',
    avatarInitials,
    accountCreationDate: raw.accountCreationDate || raw.created_at || 'Recently',
    accountStatus: (raw.accountStatus || raw.status || 'active') as any,
    verificationTier: verificationTier as any,
    vipLevel,
    country: raw.country || 'United States',
    language: raw.language || 'English (US)',
    timeZone: raw.timeZone || raw.time_zone || 'UTC-05:00 (Eastern Time)',
    displayCurrency: raw.displayCurrency || raw.display_currency || 'USD',
    dateFormat: raw.dateFormat || raw.date_format || 'YYYY-MM-DD',
    defaultDashboardView: raw.defaultDashboardView || raw.default_dashboard_view || 'pro_terminal',
    themePreference: raw.themePreference || raw.theme_preference || 'black_gold',
    twoFactorEnabled: raw.twoFactorEnabled ?? raw.two_factor_enabled ?? false,
    role: raw.role || 'user',
    notifications: raw.notifications || raw.notifications_config || {
      tradeFills: true,
      securityAlerts: true,
      priceAlerts: true,
      marketingNews: false,
    },
    // Aliases
    display_name: displayName,
    full_name: fullName,
    avatar_initials: avatarInitials,
    kyc_tier: verificationTier,
    vip_level: vipLevel,
    time_zone: raw.timeZone || raw.time_zone || 'UTC-05:00 (Eastern Time)',
    display_currency: raw.displayCurrency || raw.display_currency || 'USD',
    date_format: raw.dateFormat || raw.date_format || 'YYYY-MM-DD',
    default_dashboard_view: raw.defaultDashboardView || raw.default_dashboard_view || 'pro_terminal',
    theme_preference: raw.themePreference || raw.theme_preference || 'black_gold',
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cp_token') || sessionStorage.getItem('cp_token')
  })
  const isAuthenticated = !!token

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const curToken = localStorage.getItem('cp_token') || sessionStorage.getItem('cp_token')
      if (!curToken) return null

      const stored = authService.getStoredUser()
      if (stored) return normalizeUser(stored)
      const storedProfile = localStorage.getItem('cp_user_account_profile')
      if (storedProfile) return normalizeUser(JSON.parse(storedProfile))
      return null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const refreshUser = useCallback(async () => {
    const curToken = localStorage.getItem('cp_token') || sessionStorage.getItem('cp_token')
    if (!curToken) return

    try {
      setIsLoading(true)
      const profile = await accountService.getProfile()
      if (profile) {
        const normalized = normalizeUser(profile)
        setUser(normalized)
        localStorage.setItem('cp_user', JSON.stringify(normalized))
        localStorage.setItem('cp_user_account_profile', JSON.stringify(normalized))
      }
    } catch (err) {
      // If error (e.g. offline), keep stored user
      const stored = authService.getStoredUser()
      if (stored) {
        setUser(normalizeUser(stored))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [isAuthenticated, refreshUser])

  // Listen to cross-tab or custom login/register events
  useEffect(() => {
    const handleStorageChange = () => {
      const curToken = localStorage.getItem('cp_token') || sessionStorage.getItem('cp_token')
      setToken(curToken)

      const stored = authService.getStoredUser()
      if (stored) {
        setUser(normalizeUser(stored))
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cp_auth_changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cp_auth_changed', handleStorageChange)
    }
  }, [])

  const updateUser = async (profileData: Partial<UserAccountProfile>) => {
    try {
      const res: any = await accountService.updateProfile(profileData)
      const updatedProfile = res?.profile || { ...user, ...profileData }
      const normalized = normalizeUser(updatedProfile)
      setUser(normalized)
      localStorage.setItem('cp_user', JSON.stringify(normalized))
      localStorage.setItem('cp_user_account_profile', JSON.stringify(normalized))
      window.dispatchEvent(new Event('cp_auth_changed'))
    } catch (err) {
      // Local fallback
      const updated = normalizeUser({ ...user, ...profileData })
      setUser(updated)
      localStorage.setItem('cp_user', JSON.stringify(updated))
      localStorage.setItem('cp_user_account_profile', JSON.stringify(updated))
      window.dispatchEvent(new Event('cp_auth_changed'))
      throw err
    }
  }

  const logout = async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
    localStorage.removeItem('cp_user_account_profile')
    window.dispatchEvent(new Event('cp_auth_changed'))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        refreshUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
