/**
 * Authentication API
 * 
 * Handles all authentication-related API calls
 */

import { apiClient } from './client';
import { LoginRequest, LoginResponse, VerifyOTPRequest, VerifyOTPResponse, User } from './types';

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('api/auth/send-otp', { 
    phoneNumber 
  });
  return response.data!;
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phoneNumber: string, code: string): Promise<VerifyOTPResponse> => {
  const response = await apiClient.post<VerifyOTPResponse>('api/auth/verify-otp', {
    phoneNumber,
    code,
  });
  
  // Store token if received
  if (response.data?.token) {
    apiClient.setToken(response.data.token);
  }
  
  return response.data!;
};

/**
 * Logout user
 * Clears session token from storage
 */
export const logout = async (): Promise<void> => {
  try {
    // Clear stored session token from AsyncStorage
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.removeItem('session_token');
    console.log('✅ Session token removed from AsyncStorage');
    
    // Also try Better Auth signOut
    const { authClient } = await import('@/services/auth/betterAuth');
    await authClient.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if signOut fails, clear local token
    apiClient.setToken(null);
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
  const response = await apiClient.post<{ token: string }>('auth/refresh', {
    refreshToken,
  });
  
  if (response.data?.token) {
    apiClient.setToken(response.data.token);
  }
  
  return response.data!;
};

/**
 * Get current user profile
 * Uses /api/user/profile endpoint
 */
export const getCurrentUser = async (): Promise<User> => {
  // Check if user is authenticated
  const isAuth = await apiClient.isAuthenticated();
  if (!isAuth) {
    throw new Error('User is not authenticated. Please login first.');
  }
  
  const response = await apiClient.get<User>('api/user/profile');
  return response.data!;
};

/**
 * Update user profile
 */
export interface UpdateProfileRequest {
  name?: string;
  gender?: string;
  dob?: string;
  email?: string;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  // Check if user is authenticated
  const isAuth = await apiClient.isAuthenticated();
  if (!isAuth) {
    throw new Error('User is not authenticated. Please login first.');
  }
  
  const response = await apiClient.patch<User>('api/user/profile', data);
  return response.data!;
};

