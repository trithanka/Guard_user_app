# Services

This directory contains service modules that handle business logic and external API interactions.

## Structure

- `locationService.ts` - Handles all location-related operations:
  - Checking location services availability
  - Requesting location permissions
  - Getting current device location
  - Reverse geocoding (coordinates to address)
  - Complete location data fetching

## Usage

```typescript
import { getLocationData, requestLocationPermission } from '@/services/locationService';

// Get complete location data (coordinates + address)
const locationData = await getLocationData();

// Request permission only
const permission = await requestLocationPermission();
```

## Functions

- `checkLocationServices()` - Check if location services are enabled
- `requestLocationPermission()` - Request foreground location permissions
- `getCurrentLocation()` - Get current device coordinates
- `getAddressFromCoordinates()` - Reverse geocode coordinates to address
- `getLocationData()` - Get complete location data (coordinates + address)

