import apiClient from './api';
import { Order } from '../types';

export interface OrderCreatePayload {
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export const createOrder = async (payload: OrderCreatePayload): Promise<Order> => {
  const response = await apiClient.post<Order>('/api/v1/orders', payload);
  return response.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>('/api/v1/orders');
  return response.data;
};

export const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await apiClient.get<Order>(`/api/v1/orders/${id}`);
  return response.data;
};
