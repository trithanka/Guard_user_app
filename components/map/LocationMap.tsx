import { lightMapStyle } from '@/constants/mapStyle';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LocationCoords } from '@/services/locationService';

// Conditionally import react-native-maps (requires development build)
let MapView: any = null;
let Marker: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
} catch (error) {
  console.warn('react-native-maps not available. A development build is required.');
}

interface LocationMapProps {
  userLocation: LocationCoords | null;
  isLoading: boolean;
  hasPermission: boolean | null;
  onRetryPermission: () => void;
}

const COLORS = {
  red: '#EF4444',
  gray: '#6B7280',
  white: '#FFFFFF',
  lightGray: '#F3F4F6',
};

export const LocationMap: React.FC<LocationMapProps> = ({
  userLocation,
  isLoading,
  hasPermission,
  onRetryPermission,
}) => {
  if (isLoading) {
    return (
      <View style={styles.mapLoadingContainer}>
        <ActivityIndicator size="large" color={COLORS.red} />
        <Text style={styles.mapLoadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (!hasPermission || !userLocation) {
    return (
      <View style={styles.mapErrorContainer}>
        <MaterialIcons name="location-off" size={48} color={COLORS.gray} />
        <Text style={styles.mapErrorText}>Location access required</Text>
        <Text style={styles.mapErrorSubtext}>
          Enable location in settings to see your position on the map
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetryPermission}>
          <Text style={styles.retryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If MapView is not available (no development build), show fallback
  if (!MapView) {
    return (
      <View style={styles.mapErrorContainer}>
        <MaterialIcons name="map" size={48} color={COLORS.gray} />
        <Text style={styles.mapErrorText}>Development Build Required</Text>
        <Text style={styles.mapErrorSubtext}>
          react-native-maps requires a development build.{'\n'}
          Run: npx expo prebuild && npx expo run:android
        </Text>
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            Your Location:{'\n'}
            {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    );
  }

  // Render the map
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      region={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
      mapType="standard"
      customMapStyle={lightMapStyle}
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
      toolbarEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  mapLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  mapErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 20,
  },
  mapErrorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  mapErrorSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.red,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  coordinatesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

