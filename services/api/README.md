# API Layer Documentation

This directory contains the complete API layer for integrating with the backend.

## Base URL

The API base URL is configured in `constants/api.ts`:
```
https://guard-1-0rac.onrender.com
```

## Structure

```
services/api/
├── client.ts       # Core HTTP client
├── types.ts        # TypeScript types and interfaces
├── auth.ts         # Authentication API
├── guards.ts       # Guard-related API
├── services.ts     # Service catalog API
├── payments.ts     # Payment API
├── storage.ts      # Token and user data storage
├── example.ts      # Usage examples
├── index.ts        # Central exports
└── README.md       # This file
```

## Quick Start

### 1. Import the API client

```typescript
import { apiClient, authApi, guardsApi } from '@/services/api';
```

### 2. Set authentication token (after login)

```typescript
import { tokenStorage } from '@/services/api/storage';

// After successful login
await tokenStorage.saveToken(token);
apiClient.setToken(token);
```

### 3. Make API calls

```typescript
// Get current user
const user = await authApi.getCurrentUser();

// Request a guard
const request = await guardsApi.requestGuard({
  protectionType: 'personal',
  paymentMethod: 'upi',
  location: { latitude: 26.1445, longitude: 91.7362 },
});
```

## API Services

### Authentication (`authApi`)

```typescript
import { authApi } from '@/services/api';

// Send OTP
await authApi.sendOTP('+919876543210');

// Verify OTP
const response = await authApi.verifyOTP('+919876543210', '123456');
// response.token and response.user are available

// Get current user
const user = await authApi.getCurrentUser();

// Update profile
await authApi.updateProfile({ name: 'New Name' });

// Logout
await authApi.logout();
```

### Guards (`guardsApi`)

```typescript
import { guardsApi } from '@/services/api';

// Get available guards
const guards = await guardsApi.getAvailableGuards(latitude, longitude, 5);

// Request a guard
const request = await guardsApi.requestGuard({
  protectionType: 'personal',
  paymentMethod: 'upi',
  location: { latitude, longitude },
});

// Get my bookings
const bookings = await guardsApi.getMyBookings();

// Get booking details
const booking = await guardsApi.getBookingDetails(bookingId);

// Cancel booking
await guardsApi.cancelBooking(bookingId);

// Rate a guard
await guardsApi.rateGuard(bookingId, 5, 'Great service!');
```

### Services (`servicesApi`)

```typescript
import { servicesApi } from '@/services/api';

// Get all services
const services = await servicesApi.getServices();

// Get service details
const service = await servicesApi.getServiceDetails(serviceId);
```

### Payments (`paymentsApi`)

```typescript
import { paymentsApi } from '@/services/api';

// Get payment methods
const methods = await paymentsApi.getPaymentMethods();

// Add payment method
await paymentsApi.addPaymentMethod({
  type: 'upi',
  name: 'UPI ID',
});

// Process payment
await paymentsApi.processPayment(bookingId, methodId, amount);
```

## Error Handling

All API methods throw `ApiError` objects. Always wrap API calls in try-catch:

```typescript
import { ApiError } from '@/services/api';

try {
  const user = await authApi.getCurrentUser();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    
    // Handle specific status codes
    if (error.status === 401) {
      // Unauthorized - redirect to login
    } else if (error.status === 404) {
      // Not found
    }
  } else {
    // Network error or other error
    console.error('Unexpected error:', error);
  }
}
```

## Token Management

The API client automatically includes the token in request headers when set:

```typescript
import { apiClient, tokenStorage } from '@/services/api';

// Set token (usually after login)
const token = await tokenStorage.getToken();
if (token) {
  apiClient.setToken(token);
}

// Clear token (on logout)
await tokenStorage.clearTokens();
apiClient.setToken(null);
```

## Storage Utilities

Use the storage utilities to persist tokens and user data:

```typescript
import { tokenStorage, userStorage } from '@/services/api/storage';

// Save token
await tokenStorage.saveToken(token);

// Get token
const token = await tokenStorage.getToken();

// Save user data
await userStorage.saveUserData(user);

// Get user data
const user = await userStorage.getUserData();

// Clear all data
await clearAllData();
```

## Complete Login Flow Example

```typescript
import { authApi, tokenStorage, userStorage, apiClient } from '@/services/api';
import { ApiError } from '@/services/api';

const handleLogin = async (phone: string, otp: string) => {
  try {
    // Step 1: Verify OTP
    const response = await authApi.verifyOTP(phone, otp);
    
    // Step 2: Store token and user data
    if (response.token) {
      await tokenStorage.saveToken(response.token);
      await userStorage.saveUserData(response.user);
      apiClient.setToken(response.token);
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      Alert.alert('Error', error.message);
    } else {
      // Handle network errors
      Alert.alert('Error', 'Network error. Please check your connection.');
    }
    throw error;
  }
};
```

## Request Guard Example

```typescript
import { guardsApi, tokenStorage, apiClient } from '@/services/api';

const handleRequestGuard = async (
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

    const request = await guardsApi.requestGuard({
      protectionType,
      paymentMethod,
      location: { latitude, longitude },
    });

    return request;
  } catch (error) {
    if (error instanceof ApiError) {
      Alert.alert('Error', error.message);
    }
    throw error;
  }
};
```

## TypeScript Types

All types are exported from `services/api/types.ts`:

```typescript
import type { User, Guard, Booking, GuardRequest } from '@/services/api';
```

## Custom Headers

You can pass custom headers to any API method:

```typescript
await apiClient.get('endpoint', {}, { 'X-Custom-Header': 'value' });
```

## File Upload

For file uploads, use the `upload` method:

```typescript
const formData = new FormData();
formData.append('file', {
  uri: fileUri,
  type: 'image/jpeg',
  name: 'photo.jpg',
});

await apiClient.upload('upload/photo', formData);
```

