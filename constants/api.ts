/**
 * API Constants
 * 
 * Centralized API configuration and constants
 */

import { Platform } from 'react-native';

// ⚠️ IMPORTANT: For Physical Device Testing
// Replace this with your computer's local IP address
// Find it using: Windows: `ipconfig` | Mac/Linux: `ifconfig`
// Example: '192.168.1.100' or '10.0.0.5'
// Current IP from ipconfig: 10.175.203.53 (WiFi adapter)
const PHYSICAL_DEVICE_IP = '10.175.203.53'; // Your WiFi IP address

// Production API URL
const PRODUCTION_API_URL = 'https://guard-1-0rac.onrender.com';

// Development API URL (local server)
const DEVELOPMENT_API_URL = `http://${PHYSICAL_DEVICE_IP}:2154`;

/**
 * 🔧 MANUAL OVERRIDE: Force production API even in development
 * 
 * Set this to `true` to use production API while developing/testing.
 * This is useful for:
 * - Testing production API endpoints
 * - Testing with production data
 * - Debugging production issues
 * 
 * ⚠️ Remember to set this back to `false` when done!
 */
const FORCE_PRODUCTION_API = false; // Set to `true` to use production API

/**
 * Get the correct base URL based on platform and environment
 * 
 * Priority:
 * 1. If FORCE_PRODUCTION_API is true → Use production URL (even in dev)
 * 2. If __DEV__ is false → Use production URL (production build)
 * 3. Otherwise → Use development URL (local server)
 * 
 * - Development mode: Uses local server with computer's IP address
 * - Production mode: Uses production server URL
 */
const getBaseURL = (): string => {
  // Manual override: Force production API
  if (FORCE_PRODUCTION_API) {
    if (__DEV__) {
      console.warn('⚠️ FORCE_PRODUCTION_API is enabled - using production API in development mode!');
    }
    return PRODUCTION_API_URL;
  }
  
  // Automatic: Production build uses production API
  if (!__DEV__) {
    return PRODUCTION_API_URL;
  }
  
  // Development mode - use local server
  return DEVELOPMENT_API_URL;
};

// Base URL - automatically switches based on platform and environment
export const API_BASE_URL = getBaseURL();

// Log the API URL being used (helpful for debugging)
console.log('🔗 API Configuration:');
console.log('Environment:', __DEV__ ? 'Development' : 'Production');
console.log('Platform:', Platform.OS);
console.log('API Base URL:', API_BASE_URL);
if (FORCE_PRODUCTION_API && __DEV__) {
  console.warn('⚠️ FORCE_PRODUCTION_API is enabled - using production API!');
}
if (__DEV__ && !FORCE_PRODUCTION_API) {
  console.log('Development IP:', PHYSICAL_DEVICE_IP);
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: 'auth/login',
    VERIFY_OTP: 'auth/verify-otp',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
    ME: 'auth/me',
    PROFILE: 'auth/profile',
  },
  
  // Guards
  GUARDS: {
    AVAILABLE: 'guards/available',
    REQUEST: 'guards/request',
    DETAILS: (id: string) => `guards/${id}`,
    CANCEL_REQUEST: (id: string) => `guards/request/${id}`,
    BOOKINGS: 'guards/bookings',
    BOOKING_DETAILS: (id: string) => `guards/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `guards/bookings/${id}`,
    RATE: (id: string) => `guards/bookings/${id}/rate`,
  },
  
  // Services
  SERVICES: {
    LIST: 'services',
    DETAILS: (id: string) => `services/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    METHODS: 'payments/methods',
    ADD_METHOD: 'payments/methods',
    REMOVE_METHOD: (id: string) => `payments/methods/${id}`,
    SET_DEFAULT: (id: string) => `payments/methods/${id}/default`,
    PROCESS: 'payments/process',
  },
} as const;

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

