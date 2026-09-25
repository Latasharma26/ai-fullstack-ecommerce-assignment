import apiClient from './api';
import { Product } from '../types';

export const fetchProducts = async (activeOnly: boolean = true): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/api/v1/products', {
    params: { active_only: activeOnly },
  });
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/api/v1/products/${id}`);
  return response.data;
};

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active?: boolean;
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const response = await apiClient.post<Product>('/api/v1/products', payload);
  return response.data;
};

export const updateProduct = async (
  id: number,
  payload: Partial<CreateProductPayload>
): Promise<Product> => {
  const response = await apiClient.put<Product>(`/api/v1/products/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/v1/products/${id}`);
};

