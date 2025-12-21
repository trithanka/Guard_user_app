# Services

This directory contains service modules that handle business logic and external API interactions.

## Structure

### API Services (`api/`)
- `client.ts` - Core HTTP client with authentication and error handling
- `types.ts` - TypeScript types and interfaces for API requests/responses
- `auth.ts` - Authentication API (login, OTP verification, profile)
- `guards.ts` - Guard-related API (request guard, bookings, ratings)
- `services.ts` - Service catalog API
- `payments.ts` - Payment methods and processing API
- `index.ts` - Central export point

### Location Service
- `locationService.ts` - Handles all location-related operations:
  - Checking location services availability
  - Requesting location permissions
  - Getting current device location
  - Reverse geocoding (coordinates to address)
  - Complete location data fetching

## API Client Usage

```typescript
import { apiClient, authApi, guardsApi } from '@/services/api';

// Set authentication token
apiClient.setToken('your-jwt-token');

// Make API calls
const user = await authApi.getCurrentUser();
const guards = await guardsApi.getAvailableGuards(lat, lng);
```

## API Services

### Authentication (`authApi`)
- `sendOTP(phone)` - Send OTP to phone number
- `verifyOTP(phone, otp)` - Verify OTP and get token
- `logout()` - Logout user
- `refreshToken(refreshToken)` - Refresh access token
- `getCurrentUser()` - Get current user profile
- `updateProfile(data)` - Update user profile

### Guards (`guardsApi`)
- `getAvailableGuards(lat, lng, radius?)` - Get available guards near location
- `requestGuard(request)` - Request a guard
- `getGuardDetails(guardId)` - Get guard details
- `cancelGuardRequest(requestId)` - Cancel guard request
- `getMyBookings(status?)` - Get user's bookings
- `getBookingDetails(bookingId)` - Get booking details
- `cancelBooking(bookingId)` - Cancel booking
- `rateGuard(bookingId, rating, review?)` - Rate a guard

### Services (`servicesApi`)
- `getServices()` - Get all available services
- `getServiceDetails(serviceId)` - Get service details

### Payments (`paymentsApi`)
- `getPaymentMethods()` - Get user's payment methods
- `addPaymentMethod(method)` - Add payment method
- `removePaymentMethod(methodId)` - Remove payment method
- `setDefaultPaymentMethod(methodId)` - Set default payment method
- `processPayment(bookingId, paymentMethodId, amount)` - Process payment

## Error Handling

All API methods throw `ApiError` objects with:
- `message` - Error message
- `status` - HTTP status code (0 for network errors)
- `data` - Additional error data

```typescript
import { ApiError } from '@/services/api';

try {
  const user = await authApi.getCurrentUser();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.status);
  }
}
```

## Location Service Usage

```typescript
import { getLocationData, requestLocationPermission } from '@/services/locationService';

// Get complete location data (coordinates + address)
const locationData = await getLocationData();

// Request permission only
const permission = await requestLocationPermission();
```

## Functions

### Location Service
- `checkLocationServices()` - Check if location services are enabled
- `requestLocationPermission()` - Request foreground location permissions
- `getCurrentLocation()` - Get current device coordinates
- `getAddressFromCoordinates()` - Reverse geocode coordinates to address
- `getLocationData()` - Get complete location data (coordinates + address)
