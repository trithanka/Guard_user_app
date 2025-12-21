/**
 * API Storage Utilities
 * 
 * Handles persistent storage for authentication tokens and user data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@guard_app:auth_token',
  REFRESH_TOKEN: '@guard_app:refresh_token',
  USER_DATA: '@guard_app:user_data',
} as const;

/**
 * Token Storage
 */
export const tokenStorage = {
  /**
   * Save authentication token
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  /**
   * Save refresh token
   */
  async saveRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  /**
   * Remove refresh token
   */
  async removeRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeRefreshToken(),
    ]);
  },
};

/**
 * User Data Storage
 */
export const userStorage = {
  /**
   * Save user data
   */
  async saveUserData(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  /**
   * Get user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  /**
   * Remove user data
   */
  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },
};

/**
 * Clear all app data
 */
export const clearAllData = async (): Promise<void> => {
  await Promise.all([
    tokenStorage.clearTokens(),
    userStorage.removeUserData(),
  ]);
};

