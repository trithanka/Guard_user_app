/**
 * Payments API
 * 
 * Handles all payment-related API calls
 */

import { apiClient } from './client';
import { PaymentMethod } from './types';

/**
 * Get user's payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await apiClient.get<PaymentMethod[]>('payments/methods');
  return response.data || [];
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  const response = await apiClient.post<PaymentMethod>('payments/methods', method);
  return response.data!;
};

/**
 * Remove payment method
 */
export const removePaymentMethod = async (methodId: string): Promise<void> => {
  await apiClient.delete(`payments/methods/${methodId}`);
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (methodId: string): Promise<void> => {
  await apiClient.patch(`payments/methods/${methodId}/default`);
};

/**
 * Process payment for booking
 */
export const processPayment = async (
  bookingId: string,
  paymentMethodId: string,
  amount: number
): Promise<{ success: boolean; transactionId?: string }> => {
  const response = await apiClient.post<{ success: boolean; transactionId?: string }>(
    'payments/process',
    {
      bookingId,
      paymentMethodId,
      amount,
    }
  );
  return response.data!;
};

