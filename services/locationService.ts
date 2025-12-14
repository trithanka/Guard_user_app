import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  coordinates: LocationCoords;
  address?: string;
}

export interface LocationPermissionResult {
  granted: boolean;
  message?: string;
}

/**
 * Check if location services are enabled on the device
 */
export const checkLocationServices = async (): Promise<boolean> => {
  try {
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

/**
 * Request foreground location permissions
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        granted: false,
        message: 'Location permission is required to show your position on the map. Please enable it in settings.',
      };
    }

    return { granted: true };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      granted: false,
      message: 'Failed to request location permission. Please try again.',
    };
  }
};

/**
 * Get current device location
 */
export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to get address
 */
export const getAddressFromCoordinates = async (
  coordinates: LocationCoords
): Promise<string | null> => {
  try {
    const [address] = await Location.reverseGeocodeAsync(coordinates);
    
    if (!address) {
      return null;
    }

    const addressParts = [
      address.street,
      address.district,
      address.city,
      address.region,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(', ') : null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

/**
 * Get complete location data (coordinates + address)
 */
export const getLocationData = async (): Promise<LocationData | null> => {
  try {
    // Check if location services are enabled
    const servicesEnabled = await checkLocationServices();
    if (!servicesEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services in your device settings.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Request permission
    const permissionResult = await requestLocationPermission();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        permissionResult.message || 'Location permission is required.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Get coordinates
    const coordinates = await getCurrentLocation();
    if (!coordinates) {
      Alert.alert(
        'Error',
        'Failed to get your location. Please try again.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Get address
    const address = await getAddressFromCoordinates(coordinates);

    return {
      coordinates,
      address: address || undefined,
    };
  } catch (error) {
    console.error('Error getting location data:', error);
    Alert.alert(
      'Error',
      'Failed to get your location. Please try again.',
      [{ text: 'OK' }]
    );
    return null;
  }
};

