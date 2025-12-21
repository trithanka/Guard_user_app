/**
 * Better Auth Client Configuration for Expo
 * 
 * Handles authentication using Better Auth client with Expo-specific plugin
 */

import { API_BASE_URL } from '@/constants/api';
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

/**
 * Create Better Auth client instance
 * Configured with backend URL and Expo-specific storage
 */
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [
    expoClient({
      storage: SecureStore, // REQUIRED for session persistence
    }),
  ],
});

/**
 * Helper function to get session cookies for API calls
 * Better Auth uses cookies for authentication in Expo
 */
export const getSessionCookies = (): string | null => {
  try {
    return authClient.getCookie() || null;
  } catch (error) {
    console.error('Error getting session cookies:', error);
    return null;
  }
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await authClient.getSession();
    return !!session?.data;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Helper function to get session data
 */
export const getSession = async () => {
  try {
    const session = await authClient.getSession();
    return session?.data || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

