/**
 * API Client
 * 
 * Centralized HTTP client for all API requests
 * Handles authentication, error handling, and request/response interceptors
 */

import { API_BASE_URL } from '@/constants/api';
import { authClient } from '@/services/auth/betterAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = API_BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string | any, status?: number, data?: any) {
    // Ensure message is always a string
    let errorMessage: string;
    if (typeof message === 'string') {
      errorMessage = message;
    } else if (message && typeof message === 'object') {
      // If message is an object, try to extract a meaningful string
      if (message.message && typeof message.message === 'string') {
        errorMessage = message.message;
      } else if (message.error && typeof message.error === 'string') {
        errorMessage = message.error;
      } else {
        try {
          errorMessage = JSON.stringify(message);
        } catch {
          errorMessage = 'An error occurred';
        }
      }
    } else {
      errorMessage = String(message || 'An error occurred');
    }

    super(errorMessage);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Build full URL from endpoint
   */
  private buildURL(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Get default headers
   * Uses stored session token in Cookie header for authentication
   */
  private async getHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Try to get session token from AsyncStorage first (manual storage)
    let sessionToken: string | null = null;
    try {
      sessionToken = await AsyncStorage.getItem('session_token');
    } catch (error) {
      console.error('Error getting session token from AsyncStorage:', error);
    }

    // If we have a stored token, use it in Cookie header
    // Format: better-auth.session_token=<token>
    if (sessionToken) {
      headers['Cookie'] = `better-auth.session_token=${sessionToken}`;
      if (__DEV__) {
        console.log('🔐 Using stored session token in Cookie header');
        console.log('Cookie value:', `better-auth.session_token=${sessionToken.substring(0, 10)}...`);
      }
    } else {
      // Fallback: Try Better Auth cookies
      const cookies = authClient.getCookie();
      if (cookies) {
        headers['Cookie'] = cookies;
        if (__DEV__) {
          console.log('🔐 Using Better Auth session cookie for request');
        }
      } else if (this.token) {
        // Fallback to manually set token (for backward compatibility)
        headers['Authorization'] = `Bearer ${this.token}`;
        if (__DEV__) {
          console.log('⚠️ No session token/cookie found, using fallback token');
        }
      } else {
        if (__DEV__) {
          console.warn('⚠️ No authentication method available (no token, cookie, or stored session)');
        }
      }
    }

    return headers;
  }

  /**
   * Check if user is authenticated (has session token or cookies)
   */
  public async isAuthenticated(): Promise<boolean> {
    try {
      // Check AsyncStorage first
      const token = await AsyncStorage.getItem('session_token');
      if (token) {
        return true;
      }
      // Fallback to Better Auth cookies
      const cookies = authClient.getCookie();
      return !!cookies;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      // Log the raw response for debugging
      console.log('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        dataType: typeof data,
      });

      // Extract error message from various possible formats
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (data) {
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data === 'object' && data !== null) {
          // Try common error message fields in order of preference
          // Only extract if it's actually a string, never convert objects
          if (data.error && typeof data.error === 'object' && data.error !== null) {
            // Handle Zod validation errors
            if (data.error.name === 'ZodError' && data.error.message) {
              try {
                // Parse the Zod error message (it's a JSON string)
                const zodErrors = JSON.parse(data.error.message);
                if (Array.isArray(zodErrors) && zodErrors.length > 0) {
                  // Extract the first validation error message
                  const firstError = zodErrors[0];
                  if (firstError.message && typeof firstError.message === 'string') {
                    errorMessage = firstError.message;
                  } else {
                    errorMessage = `Validation error: ${firstError.path?.join('.') || 'unknown field'}`;
                  }
                } else {
                  errorMessage = data.error.message;
                }
              } catch {
                // If parsing fails, try to extract message directly
                if (typeof data.error.message === 'string') {
                  errorMessage = data.error.message;
                } else {
                  errorMessage = `Request failed with status ${response.status}`;
                }
              }
            } else if (data.error.message && typeof data.error.message === 'string') {
              errorMessage = data.error.message;
            } else if (typeof data.error === 'string') {
              errorMessage = data.error;
            } else {
              errorMessage = `Request failed with status ${response.status}`;
            }
          } else if (data.message) {
            if (typeof data.message === 'string') {
              errorMessage = data.message;
            } else if (typeof data.message === 'object' && data.message !== null) {
              // If message is an object, try to extract from it
              if (data.message.message && typeof data.message.message === 'string') {
                errorMessage = data.message.message;
              } else {
                errorMessage = `Request failed with status ${response.status}`;
              }
            }
          } else if (data.msg && typeof data.msg === 'string') {
            errorMessage = data.msg;
          } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            const firstError = data.errors[0];
            if (typeof firstError === 'string') {
              errorMessage = firstError;
            } else if (typeof firstError === 'object' && firstError !== null) {
              if (firstError.message && typeof firstError.message === 'string') {
                errorMessage = firstError.message;
              } else {
                errorMessage = `Request failed with status ${response.status}`;
              }
            } else {
              errorMessage = `Request failed with status ${response.status}`;
            }
          } else {
            // Last resort: use a generic message (never stringify objects)
            errorMessage = `Request failed with status ${response.status}`;
          }
        }
      }

      // Final safety check - ensure errorMessage is always a string
      if (typeof errorMessage !== 'string') {
        console.warn('Error message is not a string after extraction, using fallback');
        errorMessage = `Request failed with status ${response.status}`;
      }

      console.log('Extracted error message:', errorMessage);
      throw new ApiError(errorMessage, response.status, data);
    }

    return {
      success: true,
      data: data?.data !== undefined ? data.data : data,
      message: data?.message,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): ApiError {
    if (error instanceof ApiError) {
      // Already an ApiError instance
      return error;
    }
    
    if (error instanceof Error) {
      // Network error or other Error instance
      return new ApiError(
        error.message || 'Network error. Please check your connection.',
        0
      );
    }

    // Unknown error type
    return new ApiError(
      'An unexpected error occurred',
      0,
      error
    );
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      let url = this.buildURL(endpoint);

      // Add query parameters
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(customHeaders),
        credentials: 'omit', // Important for Better Auth
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'POST',
        headers: await this.getHeaders(customHeaders),
        credentials: 'omit', // Important for Better Auth
        body: body ? JSON.stringify(body) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'PUT',
        headers: await this.getHeaders(customHeaders),
        credentials: 'omit', // Important for Better Auth
        body: body ? JSON.stringify(body) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders(customHeaders);
      
      // Debug log for PATCH requests
      if (__DEV__ && endpoint.includes('profile')) {
        console.log('=== PATCH Request Headers ===');
        console.log('Cookie header:', headers['Cookie'] ? `${headers['Cookie'].substring(0, 50)}...` : 'Not set');
        console.log('All headers:', Object.keys(headers));
      }
      
      const response = await fetch(this.buildURL(endpoint), {
        method: 'PATCH',
        headers: headers,
        credentials: 'omit', // Important for Better Auth
        body: body ? JSON.stringify(body) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'DELETE',
        headers: await this.getHeaders(customHeaders),
        credentials: 'omit', // Important for Better Auth
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        ...customHeaders,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      // Don't set Content-Type for FormData, let browser set it with boundary
      const response = await fetch(this.buildURL(endpoint), {
        method: 'POST',
        headers,
        body: formData,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Export for custom base URL if needed
export const createApiClient = (baseURL: string) => new ApiClient(baseURL);

