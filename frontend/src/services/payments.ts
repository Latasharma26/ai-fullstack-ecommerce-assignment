import apiClient from './api';

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
  simulated: boolean;
}

export interface PaymentStatusResponse {
  order_id: number;
  payment_status: string;
  order_status: string;
  message: string;
}

export const createCheckoutSession = async (orderId: number): Promise<CheckoutSessionResponse> => {
  const response = await apiClient.post<CheckoutSessionResponse>(
    '/api/v1/payments/create-checkout-session',
    { order_id: orderId }
  );
  return response.data;
};

export const simulatePayment = async (orderId: number): Promise<PaymentStatusResponse> => {
  const response = await apiClient.post<PaymentStatusResponse>(
    `/api/v1/payments/simulate/${orderId}`
  );
  return response.data;
};
