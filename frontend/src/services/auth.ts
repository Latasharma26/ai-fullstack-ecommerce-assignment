import apiClient from './api';
import { User } from '../types';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async loginWithGoogle(credential: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/api/v1/auth/google', {
      credential,
    });
    return response.data;
  },

  async loginWithDemo(email: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/api/v1/auth/demo-login', {
      email,
    });
    return response.data;
  },

  async fetchCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {
      // Stateless logout
    }
  },
};
