/**
 * API Usage Examples
 * 
 * This file demonstrates how to use the API layer
 * You can reference this when integrating with your components
 */

import { apiClient, authApi, guardsApi, servicesApi, paymentsApi } from './index';
import { tokenStorage, userStorage } from './storage';
import { ApiError } from './client';

/**
 * Example: Login Flow
 */
export const exampleLogin = async (phone: string) => {
  try {
    // Step 1: Send OTP
    const loginResponse = await authApi.sendOTP(phone);
    console.log('OTP sent:', loginResponse.otpSent);

    // Step 2: Verify OTP (when user enters OTP)
    const verifyResponse = await authApi.verifyOTP(phone, '123456');
    
    // Step 3: Store token and user data
    if (verifyResponse.token) {
      await tokenStorage.saveToken(verifyResponse.token);
      await userStorage.saveUserData(verifyResponse.user);
      
      // Set token in API client for subsequent requests
      apiClient.setToken(verifyResponse.token);
    }

    return verifyResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Login error:', error.message, error.status);
    }
    throw error;
  }
};

/**
 * Example: Request Guard
 */
export const exampleRequestGuard = async (
  latitude: number,
  longitude: number,
  protectionType: 'personal' | 'escort' | 'standby',
  paymentMethod: 'upi' | 'card' | 'custom'
) => {
  try {
    // Ensure token is set
    const token = await tokenStorage.getToken();
    if (token) {
      apiClient.setToken(token);
    }

    const request = {
      protectionType,
      paymentMethod,
      location: {
        latitude,
        longitude,
      },
    };

    const response = await guardsApi.requestGuard(request);
    console.log('Guard requested:', response.requestId);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Request guard error:', error.message);
    }
    throw error;
  }
};

/**
 * Example: Get Available Guards
 */
export const exampleGetGuards = async (latitude: number, longitude: number) => {
  try {
    const guards = await guardsApi.getAvailableGuards(latitude, longitude, 5); // 5km radius
    console.log('Available guards:', guards.length);
    return guards;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Get guards error:', error.message);
    }
    throw error;
  }
};

/**
 * Example: Get My Bookings
 */
export const exampleGetBookings = async () => {
  try {
    const token = await tokenStorage.getToken();
    if (token) {
      apiClient.setToken(token);
    }

    const bookings = await guardsApi.getMyBookings();
    console.log('My bookings:', bookings.length);
    return bookings;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Get bookings error:', error.message);
    }
    throw error;
  }
};

/**
 * Example: Logout
 */
export const exampleLogout = async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API call success
    await tokenStorage.clearTokens();
    await userStorage.removeUserData();
    apiClient.setToken(null);
  }
};

/**
 * Example: Initialize API Client with stored token
 */
export const initializeApiClient = async () => {
  const token = await tokenStorage.getToken();
  if (token) {
    apiClient.setToken(token);
    return true;
  }
  return false;
};

