/**
 * API Types
 * 
 * Common types and interfaces for API requests and responses
 */

// User Types
export interface User {
  id: string;
  name: string | null;
  phone?: string; // Legacy field, API returns phoneNumber
  phoneNumber?: string | null; // API response field
  email?: string | null;
  gender?: string | null;
  dob?: string | null;
  phoneNumberVerified?: boolean;
  emailVerified?: boolean;
  profileImage?: string;
  isVerified?: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  phone: string;
}

export interface LoginResponse {
  user?: User;
  token?: string;
  otpSent?: boolean;
  message?: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface VerifyOTPResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Guard/Service Types
export interface Guard {
  id: string;
  name: string;
  rating: number;
  distance: number;
  image?: string;
  specialties?: string[];
  isAvailable: boolean;
}

export interface GuardRequest {
  protectionType: 'personal' | 'escort' | 'standby';
  paymentMethod: 'upi' | 'card' | 'custom';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  additionalNotes?: string;
}

export interface GuardRequestResponse {
  requestId: string;
  guard?: Guard;
  eta?: number; // in minutes
  estimatedCost?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface Booking {
  id: string;
  guardId: string;
  guardName: string;
  guardImage?: string;
  protectionType: 'personal' | 'escort' | 'standby';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  paymentMethod: 'upi' | 'card' | 'custom';
  cost?: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet';
  name: string;
  isDefault?: boolean;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

// Error Types
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

