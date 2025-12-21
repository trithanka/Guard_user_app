/**
 * Guards API
 * 
 * Handles all guard-related API calls
 */

import { apiClient } from './client';
import { Guard, GuardRequest, GuardRequestResponse, Booking } from './types';

/**
 * Get available guards near location
 */
export const getAvailableGuards = async (
  latitude: number,
  longitude: number,
  radius?: number
): Promise<Guard[]> => {
  const response = await apiClient.get<Guard[]>('guards/available', {
    latitude,
    longitude,
    radius: radius || 10, // default 10km radius
  });
  return response.data || [];
};

/**
 * Request a guard
 */
export const requestGuard = async (request: GuardRequest): Promise<GuardRequestResponse> => {
  const response = await apiClient.post<GuardRequestResponse>('guards/request', request);
  return response.data!;
};

/**
 * Get guard details by ID
 */
export const getGuardDetails = async (guardId: string): Promise<Guard> => {
  const response = await apiClient.get<Guard>(`guards/${guardId}`);
  return response.data!;
};

/**
 * Cancel guard request
 */
export const cancelGuardRequest = async (requestId: string): Promise<void> => {
  await apiClient.delete(`guards/request/${requestId}`);
};

/**
 * Get user's bookings
 */
export const getMyBookings = async (status?: string): Promise<Booking[]> => {
  const params: Record<string, any> = {};
  if (status) {
    params.status = status;
  }
  
  const response = await apiClient.get<Booking[]>('guards/bookings', params);
  return response.data || [];
};

/**
 * Get booking details
 */
export const getBookingDetails = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`guards/bookings/${bookingId}`);
  return response.data!;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete(`guards/bookings/${bookingId}`);
};

/**
 * Rate a guard after service
 */
export const rateGuard = async (
  bookingId: string,
  rating: number,
  review?: string
): Promise<void> => {
  await apiClient.post(`guards/bookings/${bookingId}/rate`, {
    rating,
    review,
  });
};

