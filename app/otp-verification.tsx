import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import { authClient } from '@/services/auth/betterAuth';

// Color scheme
const COLORS = {
  mainBackground: '#12122A', // Deep Black/Navy Blue
  primaryText: '#E0E7FF', // Glowing White/Silver
  accentGlow: '#33CCFF', // Electric Cyan/Blue
  inputBackground: '#1C1C35', // Slightly Lighter Dark Gray/Blue
  actionButton: '#00A3FF', // Bright Solid Blue
};

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mobileNumber = params.mobileNumber as string || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input
      const lastFilledIndex = Math.min(index + pastedOtp.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (!mobileNumber) {
      Alert.alert('Error', 'Mobile number not found');
      return;
    }

    setIsVerifying(true);
    try {
      // Extract 10-digit number from mobileNumber (remove +91 prefix if present)
      // mobileNumber might be "+91XXXXXXXXXX" or "XXXXXXXXXX"
      const phoneNumber = mobileNumber.startsWith('+91') 
        ? mobileNumber.substring(3) 
        : mobileNumber.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
      
      // Construct the API URL
      const apiUrl = `${API_BASE_URL}/api/auth/verify-otp`;
      const requestBody = { 
        phoneNumber: phoneNumber, // Send without +91
        code: otpString,
      };
      
      // Console log the API details
      console.log('=== Verify OTP API Request ===');
      console.log('API URL:', apiUrl);
      console.log('Method: POST');
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('============================');
      
      // Use custom endpoint to verify OTP
      // Use credentials: "include" to capture cookies from response
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies to capture Set-Cookie header
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      // Check for Set-Cookie header
      const setCookieHeader = response.headers.get('Set-Cookie');
      console.log('Set-Cookie header:', setCookieHeader);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid OTP');
      }

      const result = await response.json().catch(() => ({}));
      console.log('Verify OTP response:', result);

      // Extract and store the session token from response
      if (result.success && result.data?.token) {
        const sessionToken = result.data.token;
        console.log('✅ Session token received:', sessionToken);
        
        // Store token securely using AsyncStorage
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.setItem('session_token', sessionToken);
        console.log('✅ Session token stored in AsyncStorage');
      } else {
        console.warn('⚠️ No token found in response');
      }
      
      // Navigate to home screen on success
      Alert.alert('Success', 'OTP verified successfully!', [
        { 
          text: 'OK', 
          onPress: () => router.replace({
            pathname: '/(tabs)',
            params: { newLogin: 'true' }
          })
        }
      ]);
    } catch (error: any) {
      // Handle errors
      console.error('Verify OTP error:', error);
      const errorMessage = error?.message || 'Invalid OTP. Please try again.';
      Alert.alert('Verification Failed', errorMessage, [{ text: 'OK' }]);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!mobileNumber) {
      Alert.alert('Error', 'Mobile number not found');
      return;
    }

    setIsResending(true);
    try {
      // Extract 10-digit number from mobileNumber (remove +91 prefix if present)
      // mobileNumber might be "+91XXXXXXXXXX" or "XXXXXXXXXX"
      const phoneNumber = mobileNumber.startsWith('+91') 
        ? mobileNumber.substring(3) 
        : mobileNumber.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
      
      // Construct the API URL
      const apiUrl = `${API_BASE_URL}/api/auth/send-otp`;
      const requestBody = { phoneNumber: phoneNumber }; // Send without +91
      
      // Console log the API details
      console.log('=== Resend OTP API Request ===');
      console.log('API URL:', apiUrl);
      console.log('Method: POST');
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('=============================');
      
      // Use custom endpoint to resend OTP
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to resend OTP');
      }
      
      // Reset timer and OTP fields
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      Alert.alert('Success', 'OTP has been resent to your mobile number');
    } catch (error: any) {
      // Handle errors
      console.error('Resend OTP error:', error);
      const errorMessage = error?.message || 'Failed to resend OTP. Please try again.';
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit OTP to{'\n'}
              <Text style={styles.mobileNumber}>{mobileNumber}</Text>
            </Text>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    index === otp.findIndex((d, i) => !d && i < 6) && styles.otpInputFocused
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>

          {/* Resend OTP Section */}
          <View style={styles.resendSection}>
            {!canResend ? (
              <Text style={styles.timerText}>
                Resend OTP in <Text style={styles.timerValue}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendOTP} 
                activeOpacity={0.7}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color={COLORS.accentGlow} />
                ) : (
                  <Text style={styles.resendText}>
                    Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[styles.verifyButton, isOtpComplete && styles.verifyButtonActive]} 
            onPress={handleVerifyOTP}
            activeOpacity={0.8}
            disabled={!isOtpComplete || isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator size="small" color="#12122A" />
            ) : (
              <Text style={[styles.verifyButtonText, !isOtpComplete && styles.verifyButtonTextDisabled]}>
                VERIFY OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Change Number */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.changeNumberButton}
            activeOpacity={0.7}
          >
            <Text style={styles.changeNumberText}>
              Change Mobile Number
            </Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(224, 231, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224, 231, 255, 0.1)',
  },
  logo: {
    width: 90,
    height: 90,
    backgroundColor: 'transparent',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  mobileNumber: {
    fontWeight: '600',
    color: '#E0E7FF',
  },
  otpSection: {
    width: '100%',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 64,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2A2A3A',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: COLORS.accentGlow,
    backgroundColor: '#1E1E3A',
  },
  otpInputFocused: {
    borderColor: COLORS.accentGlow,
    backgroundColor: '#1E1E3A',
    shadowColor: COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resendSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  timerValue: {
    fontWeight: '700',
    color: '#E0E7FF',
  },
  resendText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resendLink: {
    fontWeight: '600',
    color: COLORS.accentGlow,
    textDecorationLine: 'underline',
  },
  verifyButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#2A2A3A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#3A3A4A',
  },
  verifyButtonActive: {
    backgroundColor: '#E0E7FF',
    borderColor: '#E0E7FF',
    shadowColor: '#E0E7FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12122A',
    letterSpacing: 1.2,
  },
  verifyButtonTextDisabled: {
    color: '#6B7280',
  },
  changeNumberButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
});

