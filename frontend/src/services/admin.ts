import apiClient from './api';
import { Order } from '../types';

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  paid_orders: number;
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get<AdminStats>('/api/v1/admin/stats');
  return response.data;
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>('/api/v1/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId: number, newStatus: string): Promise<Order> => {
  const response = await apiClient.patch<Order>(`/api/v1/admin/orders/${orderId}/status`, {
    status: newStatus,
  });
  return response.data;
};
