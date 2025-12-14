import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const COLORS = {
  red: '#EF4444',
  white: '#FFFFFF',
  blue: '#3B82F6',
};

/**
 * Custom styled location marker similar to Uber/Rapido
 * Shows a pin with a pulsing circle effect
 */
export const CustomLocationMarker: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulsing animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const pulseStyle = {
    transform: [{ scale: pulseAnim }],
    opacity: pulseAnim.interpolate({
      inputRange: [1, 1.8],
      outputRange: [0.4, 0],
    }),
  };

  return (
    <View style={styles.wrapper} pointerEvents="none" collapsable={false}>
      {/* Animated pulsing outer circle */}
      <Animated.View style={[styles.pulseCircle, pulseStyle]} />
      
      {/* Inner circle with icon */}
      <View style={styles.innerCircle}>
        <Ionicons name="location" size={18} color={COLORS.white} />
      </View>
      
      {/* Pin point at bottom */}
      <View style={styles.pinPoint} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  pulseCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.red,
    top: 4,
    alignSelf: 'center',
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
    marginBottom: 8,
  },
  pinPoint: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.red,
    zIndex: 5,
    alignSelf: 'center',
  },
});

