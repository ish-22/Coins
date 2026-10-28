import apiClient from './apiClient'
import { NotificationItem } from '@/mock/notificationsData'

export interface NotificationsListResponse {
  notifications: NotificationItem[]
}

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get<NotificationsListResponse>('/notifications')
    return res.data.notifications
  },

  async markAsRead(id: string | number): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`)
  },

  async toggleRead(id: string | number): Promise<{ isRead: boolean }> {
    const res = await apiClient.put<{ isRead: boolean }>(`/notifications/${id}/toggle-read`)
    return res.data
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all')
  },

  async deleteNotification(id: string | number): Promise<void> {
    await apiClient.delete(`/notifications/${id}`)
  },

  async clearAllRead(): Promise<void> {
    await apiClient.delete('/notifications/clear/read')
  },
}

export default notificationService
