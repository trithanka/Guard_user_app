import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

// Color scheme
const COLORS = {
  mainBackground: '#12122A', // Deep Black/Navy Blue
  primaryText: '#E0E7FF', // Glowing White/Silver
  accentGlow: '#33CCFF', // Electric Cyan/Blue
  inputBackground: '#1C1C35', // Slightly Lighter Dark Gray/Blue
  actionButton: '#00A3FF', // Bright Solid Blue
};

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<TextInput>(null);

  const handleSendOTP = async () => {
    if (mobileNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      // Send phone number without country code prefix (backend expects 10 digits)
      // Format: XXXXXXXXXX (10 digits only)
      const phoneNumber = mobileNumber; // Already 10 digits from input
      
      // Construct the API URL
      const apiUrl = `${API_BASE_URL}/api/auth/send-otp`;
      const requestBody = { phoneNumber }; // Send without +91
      
      // Console log the API details
      console.log('=== Send OTP API Request ===');
      console.log('API URL:', apiUrl);
      console.log('Method: POST');
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('===========================');
      
      // Use custom endpoint to send OTP
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      
      // Navigate to OTP verification screen on success
      // Store with country code for display purposes only
      router.push({
        pathname: '/otp-verification',
        params: { mobileNumber: `+91${mobileNumber}` } // Display format only
      });
    } catch (error: any) {
      // Handle errors
      console.error('Send OTP error:', error);
      const errorMessage = error?.message || 'Failed to send OTP. Please try again.';
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bounces={false}
      >
        <View style={styles.content}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/splashLogo-removebg-preview.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Guardly</Text>
            <Text style={styles.welcomeSubtitle}>Enter your mobile number to continue</Text>
          </View>

          {/* Mobile Number Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Mobile Number</Text>
            <TouchableOpacity 
              activeOpacity={1}
              style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
              onPress={() => {
                // Focus the input when wrapper is pressed
                const input = inputRefs.current;
                if (input) {
                  input.focus();
                }
              }}
            >
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.inputDivider} />
              <TextInput
                ref={(ref) => {
                  inputRefs.current = ref;
                }}
                style={styles.input}
                value={mobileNumber}
                onChangeText={(text) => {
                  // Only allow numeric characters
                  const numericText = text.replace(/[^0-9]/g, '');
                  setMobileNumber(numericText);
                }}
                keyboardType="number-pad"
                autoComplete="tel"
                placeholder="Enter your mobile number"
                placeholderTextColor="#6B7280"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={10}
                editable={true}
                autoFocus={false}
                showSoftInputOnFocus={true}
                returnKeyType="done"
              />
            </TouchableOpacity>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity 
            style={[styles.sendOTPButton, mobileNumber.length >= 10 && styles.sendOTPButtonActive]} 
            onPress={handleSendOTP}
            activeOpacity={0.8}
            disabled={mobileNumber.length < 10 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#12122A" />
            ) : (
              <Text style={[styles.sendOTPButtonText, mobileNumber.length < 10 && styles.sendOTPButtonTextDisabled]}>
                SEND OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms & Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms & Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: 'rgba(224, 231, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224, 231, 255, 0.1)',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E7FF',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2A2A3A',
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  inputWrapperFocused: {
    borderColor: COLORS.accentGlow,
    backgroundColor: '#1E1E3A',
    shadowColor: COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E7FF',
    marginRight: 12,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#3A3A4A',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    paddingVertical: 0,
    minHeight: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  sendOTPButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#2A2A3A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: '#3A3A4A',
  },
  sendOTPButtonActive: {
    backgroundColor: '#E0E7FF',
    borderColor: '#E0E7FF',
    shadowColor: '#E0E7FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sendOTPButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12122A',
    letterSpacing: 1.2,
  },
  sendOTPButtonTextDisabled: {
    color: '#6B7280',
  },
  termsContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '600',
    color: '#E0E7FF',
    textDecorationLine: 'underline',
  },
});

