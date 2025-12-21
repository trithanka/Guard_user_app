/**
 * Services API
 * 
 * Handles all service-related API calls
 */

import { apiClient } from './client';
import { Service } from './types';

/**
 * Get all available services
 */
export const getServices = async (): Promise<Service[]> => {
  const response = await apiClient.get<Service[]>('services');
  return response.data || [];
};

/**
 * Get service details by ID
 */
export const getServiceDetails = async (serviceId: string): Promise<Service> => {
  const response = await apiClient.get<Service>(`services/${serviceId}`);
  return response.data!;
};

