import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';

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

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      // TODO: Verify OTP with backend
      console.log('Verifying OTP:', otpString);
      Alert.alert('Success', 'OTP verified successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } else {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
    }
  };

  const handleResendOTP = () => {
    // TODO: Resend OTP
    console.log('Resending OTP to:', mobileNumber);
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    Alert.alert('Success', 'OTP has been resent to your mobile number');
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
              <TouchableOpacity onPress={handleResendOTP} activeOpacity={0.7}>
                <Text style={styles.resendText}>
                  Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[styles.verifyButton, isOtpComplete && styles.verifyButtonActive]} 
            onPress={handleVerifyOTP}
            activeOpacity={0.8}
            disabled={!isOtpComplete}
          >
            <Text style={[styles.verifyButtonText, !isOtpComplete && styles.verifyButtonTextDisabled]}>
              VERIFY OTP
            </Text>
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

