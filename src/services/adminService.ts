import apiClient from './apiClient'
import {
  AdminUser,
  AdminKycCase,
  AdminDepositRecord,
  AdminDepositMethod,
  AdminWithdrawalRecord,
  AdminOrderRecord,
  AdminAnnouncement,
  AdminAssetRecord,
  AdminAuditLog,
  AdminSupportTicket,
  AdminTraderRecord,
  AdminTradingStats,
  AdminTradingConfig,
  UserBalanceDetailsResponse,
  AdminUserDetailsResponse,
  BalanceAdjustmentPayload,
  AdminNotificationDispatch,
  SendNotificationPayload,
} from '@/mock/adminData'

const normalizeAdminUser = (user: Partial<AdminUser> & Record<string, any>): AdminUser => ({
  id: String(user.id ?? ''),
  userRef: user.userRef ?? user.uid ?? 'UID-N/A',
  name: user.name ?? user.full_name ?? 'Unknown User',
  email: user.email ?? '',
  phone: user.phone ?? user.phone_number ?? 'Not provided',
  role: user.role ?? 'user',
  country: user.country ?? 'United States',
  countryCode: user.countryCode ?? user.country_code ?? 'US',
  status: (user.status as AdminUser['status']) ?? 'active',
  kycTier: (user.kycTier as AdminUser['kycTier']) ?? 'Tier 0',
  balanceUsd: Number(user.balanceUsd ?? 0),
  registeredAt: user.registeredAt ?? user.created_at ?? 'N/A',
  lastLogin: user.lastLogin ?? 'Active recently',
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
    phone?: string
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
      phone?: string
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

  async updateUserStatus(id: string | number, status: 'active' | 'suspended' | 'pending' | 'blocked') {
    const res = await apiClient.put(`/admin/users/${id}/status`, { status })
    return res.data
  },

  async getUserBalanceDetails(id: string | number): Promise<UserBalanceDetailsResponse> {
    const res = await apiClient.get<UserBalanceDetailsResponse>(`/admin/users/${id}/balance`)
    return res.data
  },

  async getUserDetails(id: string | number): Promise<AdminUserDetailsResponse> {
    const res = await apiClient.get<AdminUserDetailsResponse>(`/admin/users/${id}/details`)
    return res.data
  },

  async adjustUserBalance(id: string | number, payload: BalanceAdjustmentPayload) {
    const res = await apiClient.post<{
      message: string
      wallet: any
      transaction: any
    }>(`/admin/users/${id}/balance-adjustment`, payload)
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

  async getDeposits(params?: { status?: string; user_id?: string; asset?: string; q?: string }): Promise<AdminDepositRecord[]> {
    const res = await apiClient.get<{ deposits: AdminDepositRecord[] }>('/admin/deposits', { params })
    return res.data.deposits
  },

  async reviewDeposit(id: string | number, action: 'approve' | 'reject', reason?: string): Promise<{ message: string; deposit: AdminDepositRecord }> {
    const res = await apiClient.post(`/admin/deposits/${id}/review`, { action, reason })
    return res.data
  },

  async getDepositMethods(): Promise<AdminDepositMethod[]> {
    const res = await apiClient.get<{ methods: AdminDepositMethod[] }>('/admin/deposits/methods')
    return res.data.methods
  },

  async updateDepositMethods(methods: AdminDepositMethod[]): Promise<{ message: string; methods: AdminDepositMethod[] }> {
    const res = await apiClient.put<{ message: string; methods: AdminDepositMethod[] }>('/admin/deposits/methods', { methods })
    return res.data
  },

  async updateDepositWalletAddress(asset: string, address: string, network?: string, memo?: string): Promise<{ message: string; methods: AdminDepositMethod[] }> {
    const res = await apiClient.post<{ message: string; methods: AdminDepositMethod[] }>('/admin/deposits/wallet-address', { asset, address, network, memo })
    return res.data
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

  async getTradingOverview(): Promise<{
    orders: AdminOrderRecord[]
    traders: AdminTraderRecord[]
    stats: AdminTradingStats
    settings: AdminTradingConfig
  }> {
    const res = await apiClient.get<{
      orders: AdminOrderRecord[]
      traders: AdminTraderRecord[]
      stats: AdminTradingStats
      settings: AdminTradingConfig
    }>('/admin/trading/overview')
    return res.data
  },

  async getTraderPerformance(id: string | number): Promise<{
    trader: AdminTraderRecord
    performance: any
    history: AdminOrderRecord[]
  }> {
    const res = await apiClient.get<{
      trader: AdminTraderRecord
      performance: any
      history: AdminOrderRecord[]
    }>(`/admin/trading/traders/${id}`)
    return res.data
  },

  async updateTradingSettings(settings: Partial<AdminTradingConfig>): Promise<{
    settings: AdminTradingConfig
    message: string
  }> {
    const res = await apiClient.put<{
      settings: AdminTradingConfig
      message: string
    }>('/admin/trading/settings', { settings })
    return res.data
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

  async getSupportTickets(params?: { q?: string; status?: string }): Promise<{
    tickets: AdminSupportTicket[]
    metrics?: {
      totalTickets: number
      unreadTotal: number
      openCount: number
      inProgressCount: number
      waitingUserCount: number
      resolvedCount: number
      closedCount: number
    }
  }> {
    const res = await apiClient.get<{
      tickets: AdminSupportTicket[]
      metrics?: {
        totalTickets: number
        unreadTotal: number
        openCount: number
        inProgressCount: number
        waitingUserCount: number
        resolvedCount: number
        closedCount: number
      }
    }>('/admin/support-tickets', { params })
    return res.data
  },

  async replySupportTicket(id: string | number, message: string) {
    const res = await apiClient.post(`/admin/support-tickets/${id}/reply`, { message })
    return res.data
  },

  async markSupportTicketRead(id: string | number) {
    const res = await apiClient.post(`/admin/support-tickets/${id}/read`)
    return res.data
  },

  async updateTicketStatus(id: string | number, status: string) {
    const res = await apiClient.put(`/admin/support-tickets/${id}/status`, { status })
    return res.data
  },

  async getAuditLogs(params?: { q?: string; category?: string; limit?: number }): Promise<AdminAuditLog[]> {
    const res = await apiClient.get<any>('/admin/audit-logs', { params })
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.logs)) return res.data.logs
    if (Array.isArray(res.data?.data)) return res.data.data
    return []
  },

  async getSettings() {
    const res = await apiClient.get('/admin/settings')
    return res.data.settings
  },

  async updateSettings(settings: Record<string, unknown>) {
    const res = await apiClient.put('/admin/settings', { settings })
    return res.data
  },

  async getNotificationHistory(): Promise<{ dispatches: AdminNotificationDispatch[]; totalSent: number }> {
    const res = await apiClient.get<{ dispatches: AdminNotificationDispatch[]; totalSent: number }>('/admin/notifications/history')
    return res.data
  },

  async sendNotification(payload: SendNotificationPayload): Promise<{ message: string; dispatch: AdminNotificationDispatch; deliveredCount: number }> {
    const res = await apiClient.post<{ message: string; dispatch: AdminNotificationDispatch; deliveredCount: number }>('/admin/notifications/send', payload)
    return res.data
  },

  async deleteNotificationDispatch(id: string | number): Promise<{ message: string }> {
    const res = await apiClient.delete(`/admin/notifications/history/${id}`)
    return res.data
  },
}

export default adminService
