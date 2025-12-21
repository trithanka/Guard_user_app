/**
 * API Services Index
 * 
 * Central export point for all API services
 */

export * from './client';
export * from './types';

// API Services
export * as authApi from './auth';
export * as guardsApi from './guards';
export * as servicesApi from './services';
export * as paymentsApi from './payments';

// Re-export for convenience
export { apiClient } from './client';

