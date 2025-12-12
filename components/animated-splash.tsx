import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

type AnimatedSplashProps = {
  onAnimationComplete: () => void;
};

// Color scheme
const COLORS = {
  mainBackground: '#12122A', // Deep Black/Navy Blue
  primaryText: '#E0E7FF', // Glowing White/Silver
  accentGlow: '#33CCFF', // Electric Cyan/Blue
  inputBackground: '#1C1C35', // Slightly Lighter Dark Gray/Blue
  actionButton: '#00A3FF', // Bright Solid Blue
};

export function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  useEffect(() => {
    // Hide splash screen after delay
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/splashLogo-removebg-preview.png')}
          style={styles.logo}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
          onError={(error) => {
            console.log('Image loading error:', error);
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />
      </View>

      {/* Made in India Text */}
      <Text style={styles.madeInIndiaText}>
        MADE IN INDIA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.mainBackground,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 220,
    zIndex: 9999,
    elevation: 9999, // For Android
  },
  logoContainer: {
    zIndex: 1,
  },
  logo: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
  },
  madeInIndiaText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    opacity: 1,
  },
});

