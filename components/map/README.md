# Map Components

This directory contains map-related React components.

## Components

### LocationMap

A reusable component that displays a map with the user's current location.

**Props:**
- `userLocation: LocationCoords | null` - User's current coordinates
- `isLoading: boolean` - Loading state
- `hasPermission: boolean | null` - Permission status
- `onRetryPermission: () => void` - Callback to retry permission request

**Features:**
- Shows loading state while fetching location
- Displays map with user location marker
- Handles permission denied state
- Shows fallback UI when development build is not available
- Displays coordinates when map is unavailable

**Usage:**

```tsx
import { LocationMap } from '@/components/map/LocationMap';

<LocationMap
  userLocation={userLocation}
  isLoading={isLoadingLocation}
  hasPermission={locationPermission}
  onRetryPermission={handleRetryPermission}
/>
```

## Dependencies

- `react-native-maps` - Requires development build (not Expo Go)
- `expo-location` - For location services

