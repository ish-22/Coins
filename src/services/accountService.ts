import apiClient from './apiClient'
import { UserAccountProfile } from '@/mock/accountData'

export const accountService = {
  async getProfile(): Promise<UserAccountProfile> {
    const res = await apiClient.get<{ profile: UserAccountProfile }>('/account/profile')
    return res.data.profile
  },

  async updateProfile(data: Partial<UserAccountProfile>): Promise<unknown> {
    const res = await apiClient.put('/account/profile', data)
    return res.data
  },

  async changePassword(data: { current_password: string; password: string }): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>('/account/change-password', data)
    return res.data
  },

  async toggle2FA(enabled: boolean): Promise<{ twoFactorEnabled: boolean; message: string }> {
    const res = await apiClient.post<{ twoFactorEnabled: boolean; message: string }>('/account/2fa/toggle', { enabled })
    return res.data
  },

  async getSessions() {
    const res = await apiClient.get('/account/sessions')
    return res.data.sessions
  },
}

export default accountService
