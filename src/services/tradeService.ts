import apiClient from './apiClient'
import { ActiveOrder } from '@/mock/tradingData'

export interface PlaceOrderPayload {
  pair: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  price: number
  amount: number
}

export const tradeService = {
  async getOrders(): Promise<{ openOrders: ActiveOrder[]; orderHistory: ActiveOrder[] }> {
    const res = await apiClient.get<{ openOrders: ActiveOrder[]; orderHistory: ActiveOrder[] }>(
      '/trade/orders'
    )
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
