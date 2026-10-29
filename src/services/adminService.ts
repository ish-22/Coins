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
  AdminSupportTicket,
} from '@/mock/adminData'

const normalizeAdminUser = (user: Partial<AdminUser> & Record<string, any>): AdminUser => ({
  id: String(user.id ?? ''),
  userRef: user.userRef ?? user.uid ?? 'UID-N/A',
  name: user.name ?? user.full_name ?? 'Unknown User',
  email: user.email ?? '',
  country: user.country ?? 'United States',
  countryCode: user.countryCode ?? user.country_code ?? 'US',
  status: (user.status as AdminUser['status']) ?? 'pending',
  kycTier: (user.kycTier as AdminUser['kycTier']) ?? 'Tier 0',
  balanceUsd: Number(user.balanceUsd ?? 0),
  registeredAt: user.registeredAt ?? user.created_at ?? 'N/A',
  lastLogin: user.lastLogin ?? 'N/A',
  twoFactorEnabled: Boolean(user.twoFactorEnabled ?? false),
  passkeyRegistered: Boolean(user.passkeyRegistered ?? user.passkeysRegistered ?? false),
  ipAddress: user.ipAddress ?? '127.0.0.1',
})

export const adminService = {
  async getMetrics() {
    const res = await apiClient.get('/admin/metrics')
    return res.data.metrics
  },

  async getUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<{ users: any[] }>('/admin/users')
    return (res.data.users ?? []).map(normalizeAdminUser)
  },

  async createUser(data: {
    name: string
    email: string
    password?: string
    role?: string
    status?: string
    kyc_tier?: string
    country?: string
    initial_balance_usd?: number
  }) {
    const res = await apiClient.post('/admin/users', data)
    return res.data
  },

  async updateUser(
    id: string | number,
    data: {
      name?: string
      email?: string
      password?: string
      role?: string
      status?: string
      kyc_tier?: string
      country?: string
      balance_usd?: number
    }
  ) {
    const res = await apiClient.put(`/admin/users/${id}`, data)
    return res.data
  },

  async deleteUser(id: string | number) {
    const res = await apiClient.delete(`/admin/users/${id}`)
    return res.data
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

  async reviewWithdrawal(id: string | number, action: 'approve' | 'reject', reason?: string) {
    const res = await apiClient.post(`/admin/withdrawals/${id}/review`, { action, reason })
    return res.data
  },

  async getOrders(): Promise<AdminOrderRecord[]> {
    const res = await apiClient.get<{ orders: AdminOrderRecord[] }>('/admin/orders')
    return res.data.orders
  },

  async cancelOrder(id: string) {
    const res = await apiClient.delete(`/admin/orders/${id}`)
    return res.data
  },

  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const res = await apiClient.get<{ announcements: AdminAnnouncement[] }>('/announcements')
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

  async updateAnnouncement(
    id: string | number,
    data: {
      title: string
      content: string
      type: string
      targetAudience: string
      status?: string
      validUntil?: string
    }
  ) {
    const res = await apiClient.put(`/admin/announcements/${id}`, data)
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

  async createAsset(data: {
    symbol: string
    name: string
    price_usd: number
    networks?: string[]
    depositEnabled?: boolean
    withdrawEnabled?: boolean
    tradingEnabled?: boolean
    minDeposit?: number
    minWithdrawal?: number
    withdrawalFee?: number
  }) {
    const res = await apiClient.post('/admin/assets', data)
    return res.data
  },

  async updateAsset(
    id: string,
    data: {
      name?: string
      price_usd?: number
      depositEnabled?: boolean
      withdrawEnabled?: boolean
      tradingEnabled?: boolean
      withdrawalFee?: number
      minDeposit?: number
      minWithdrawal?: number
    }
  ) {
    const res = await apiClient.put(`/admin/assets/${id}`, data)
    return res.data
  },

  async deleteAsset(id: string) {
    const res = await apiClient.delete(`/admin/assets/${id}`)
    return res.data
  },

  async getSupportTickets(): Promise<AdminSupportTicket[]> {
    const res = await apiClient.get<{ tickets: AdminSupportTicket[] }>('/admin/support-tickets')
    return res.data.tickets
  },

  async replySupportTicket(id: string | number, message: string) {
    const res = await apiClient.post(`/admin/support-tickets/${id}/reply`, { message })
    return res.data
  },

  async updateTicketStatus(id: string | number, status: string) {
    const res = await apiClient.put(`/admin/support-tickets/${id}/status`, { status })
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
