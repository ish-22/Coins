import apiClient from './apiClient'
import {
  AdminUser,
  AdminKycCase,
  AdminDepositRecord,
  AdminWithdrawalRecord,
  AdminOrderRecord,
  AdminAnnouncement,
  AdminAssetRecord,
  AdminAuditLog,
} from '@/mock/adminData'

export const adminService = {
  async getMetrics() {
    const res = await apiClient.get('/admin/metrics')
    return res.data.metrics
  },

  async getUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<{ users: AdminUser[] }>('/admin/users')
    return res.data.users
  },

  async updateUserStatus(id: string | number, status: 'active' | 'suspended' | 'pending') {
    const res = await apiClient.put(`/admin/users/${id}/status`, { status })
    return res.data
  },

  async getKycCases(): Promise<AdminKycCase[]> {
    const res = await apiClient.get<{ cases: AdminKycCase[] }>('/admin/kyc')
    return res.data.cases
  },

  async reviewKycCase(id: string | number, action: 'approve' | 'reject', rejectionReason?: string) {
    const res = await apiClient.post(`/admin/kyc/${id}/review`, {
      action,
      rejectionReason,
    })
    return res.data
  },

  async getDeposits(): Promise<AdminDepositRecord[]> {
    const res = await apiClient.get<{ deposits: AdminDepositRecord[] }>('/admin/deposits')
    return res.data.deposits
  },

  async getWithdrawals(): Promise<AdminWithdrawalRecord[]> {
    const res = await apiClient.get<{ withdrawals: AdminWithdrawalRecord[] }>('/admin/withdrawals')
    return res.data.withdrawals
  },

  async getOrders(): Promise<AdminOrderRecord[]> {
    const res = await apiClient.get<{ orders: AdminOrderRecord[] }>('/admin/orders')
    return res.data.orders
  },

  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const res = await apiClient.get<{ announcements: AdminAnnouncement[] }>('/admin/announcements')
    return res.data.announcements
  },

  async createAnnouncement(data: {
    title: string
    content: string
    type: string
    targetAudience: string
    validUntil?: string
  }) {
    const res = await apiClient.post('/admin/announcements', data)
    return res.data
  },

  async deleteAnnouncement(id: string | number) {
    const res = await apiClient.delete(`/admin/announcements/${id}`)
    return res.data
  },

  async getAssets(): Promise<AdminAssetRecord[]> {
    const res = await apiClient.get<{ assets: AdminAssetRecord[] }>('/admin/assets')
    return res.data.assets
  },

  async updateAsset(
    id: string,
    data: {
      depositEnabled?: boolean
      withdrawEnabled?: boolean
      tradingEnabled?: boolean
      withdrawalFee?: number
    }
  ) {
    const res = await apiClient.put(`/admin/assets/${id}`, data)
    return res.data
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    const res = await apiClient.get<{ logs: AdminAuditLog[] }>('/admin/audit-logs')
    return res.data.logs
  },

  async getSettings() {
    const res = await apiClient.get('/admin/settings')
    return res.data.settings
  },

  async updateSettings(settings: Record<string, unknown>) {
    const res = await apiClient.put('/admin/settings', { settings })
    return res.data
  },
}

export default adminService
