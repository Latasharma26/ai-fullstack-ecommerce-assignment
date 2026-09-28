import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://shopai-backend-aiit.onrender.com'
    : 'http://localhost:8000');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Automatically inject JWT token from localStorage if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopai_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export interface HealthCheckResponse {
  status: string;
  api: string;
  environment: string;
  timestamp: string;
  database: {
    status: string;
    database?: string;
    error?: string;
  };
}

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
};

export default apiClient;
