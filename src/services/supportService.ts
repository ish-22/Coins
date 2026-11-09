import { apiClient } from './apiClient'
import { SupportCategory, SupportTicket, TicketMessage } from '@/mock/supportData'

export interface SupportListResponse {
  tickets: SupportTicket[]
  totalUnread: number
}

export interface CreateTicketPayload {
  subject: string
  category: SupportCategory | string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  message: string
  attachmentName?: string | null
  attachmentData?: string | null
}

export const supportService = {
  async getTickets(): Promise<SupportListResponse> {
    const response = await apiClient.get<SupportListResponse>('/support/tickets')
    return response.data
  },

  async createTicket(payload: CreateTicketPayload): Promise<{ ticket: SupportTicket; message: string }> {
    const response = await apiClient.post<{ ticket: SupportTicket; message: string }>('/support/tickets', payload)
    return response.data
  },

  async replyTicket(
    ticketId: string | number,
    message: string,
    attachment?: { name: string; data: string } | null
  ): Promise<{ reply: TicketMessage; ticket?: Partial<SupportTicket>; message: string }> {
    const response = await apiClient.post<{ reply: TicketMessage; ticket?: Partial<SupportTicket>; message: string }>(
      `/support/tickets/${ticketId}/reply`,
      {
        message,
        attachmentName: attachment?.name,
        attachmentData: attachment?.data,
      }
    )
    return response.data
  },

  async markTicketRead(ticketId: string | number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/support/tickets/${ticketId}/read`)
    return response.data
  },

  async updateTicketStatus(
    ticketId: string | number,
    status: 'open' | 'resolved' | 'closed'
  ): Promise<{ success: boolean; status: string; message: string }> {
    const response = await apiClient.put<{ success: boolean; status: string; message: string }>(
      `/support/tickets/${ticketId}/status`,
      { status }
    )
    return response.data
  },
}
