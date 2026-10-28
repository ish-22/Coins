import apiClient from './apiClient'
import { ActiveOrder } from '@/mock/tradingData'

export interface PlaceOrderPayload {
  pair: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  price: number
  amount: number
  stopPrice?: number
}

export interface TradeOrdersResponse {
  openOrders: (ActiveOrder & { dateTime?: string; feeEstimate?: number })[]
  orderHistory: (ActiveOrder & { createdAt?: string; updatedAt?: string; fee?: number; feeAsset?: string; avgPrice?: number; executed?: number })[]
  tradeHistory?: any[]
}

export const tradeService = {
  async getOrders(): Promise<TradeOrdersResponse> {
    const res = await apiClient.get<TradeOrdersResponse>('/trade/orders')
    return res.data
  },

  async placeOrder(payload: PlaceOrderPayload): Promise<{ order: ActiveOrder; message: string }> {
    const res = await apiClient.post<{ order: ActiveOrder; message: string }>('/trade/orders', payload)
    return res.data
  },

  async cancelOrder(orderId: string): Promise<{ order: ActiveOrder; message: string }> {
    const res = await apiClient.post<{ order: ActiveOrder; message: string }>(
      `/trade/orders/${orderId}/cancel`
    )
    return res.data
  },
}

export default tradeService
