import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authApi } from '@/services/api';
import { ApiError } from '@/services/api/client';

// Color scheme
const COLORS = {
  mainBackground: '#12122A',
  primaryText: '#E0E7FF',
  accentGlow: '#33CCFF',
  inputBackground: '#1C1C35',
  actionButton: '#00A3FF',
  red: '#EF4444',
  white: '#FFFFFF',
  gray: '#6B7280',
  darkGray: '#2A2A3A',
};

type ProfileSetupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profileData: {
    name: string;
    gender: string;
    dob: string;
    email?: string;
  }) => void;
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function ProfileSetupModal({
  visible,
  onClose,
  onSubmit,
}: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    gender?: string;
    dob?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!dob || !(dob instanceof Date) || isNaN(dob.getTime())) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      // Check if date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dob);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.dob = 'Date of Birth cannot be in the future';
      }
      // Check if age is reasonable (e.g., at least 13 years old)
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (actualAge < 13) {
        newErrors.dob = 'You must be at least 13 years old';
      }
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date: Date | null): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date: Date | null): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    // Format as YYYY-MM-DD for API
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      // On Android, if user cancels, event.type will be 'dismissed'
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setDob(selectedDate);
      if (errors.dob) {
        setErrors({ ...errors, dob: undefined });
      }
    }
  };

  const handleDatePickerConfirm = () => {
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!validateForm() || !dob) {
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update data
      const updateData: {
        name?: string;
        gender?: string;
        dob?: string;
        email?: string;
      } = {};

      if (name.trim()) {
        updateData.name = name.trim();
      }
      if (gender) {
        updateData.gender = gender;
      }
      if (dob) {
        updateData.dob = formatDateForAPI(dob);
      }
      if (email.trim()) {
        updateData.email = email.trim();
      }

      console.log('=== Profile Setup API Request ===');
      console.log('API Endpoint: PATCH /api/user/profile');
      console.log('Request Body:', JSON.stringify(updateData, null, 2));
      console.log('================================');

      // Call API to update profile
      const updatedUser = await authApi.updateProfile(updateData);
      
      console.log('Profile updated successfully:', updatedUser);

      // Call the onSubmit callback with formatted data
      onSubmit({
        name: name.trim(),
        gender,
        dob: formatDate(dob),
        email: email.trim() || undefined,
      });

      // Reset form
      setName('');
      setGender('');
      setDob(null);
      setEmail('');
      setErrors({});
      
      Alert.alert('Success', 'Profile setup completed successfully!', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      console.error('Profile setup error:', error);
      if (error instanceof ApiError) {
        Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
      } else {
        Alert.alert('Network Error', 'Unable to connect. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderPicker(false);
    if (errors.gender) {
      setErrors({ ...errors, gender: undefined });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Setup Your Profile</Text>
              <Text style={styles.subtitle}>
                Please provide some basic information to get started
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.gray}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerInput, errors.gender && styles.inputError]}
                onPress={() => setShowGenderPicker(!showGenderPicker)}
              >
                <Text style={[styles.pickerText, !gender && styles.placeholderText]}>
                  {gender || 'Select gender'}
                </Text>
                <MaterialIcons
                  name={showGenderPicker ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color={COLORS.primaryText}
                />
              </TouchableOpacity>
              {showGenderPicker && (
                <View style={styles.genderPicker}>
                  {GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        gender === option && styles.genderOptionSelected,
                      ]}
                      onPress={() => handleGenderSelect(option)}
                    >
                      <Text
                        style={[
                          styles.genderOptionText,
                          gender === option && styles.genderOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                      {gender === option && (
                        <MaterialIcons name="check" size={20} color={COLORS.accentGlow} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            {/* Date of Birth Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Date of Birth <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerInput, errors.dob && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.pickerText, !dob && styles.placeholderText]}>
                  {dob ? formatDate(dob) : 'Select date of birth'}
                </Text>
                <MaterialIcons name="calendar-today" size={20} color={COLORS.primaryText} />
              </TouchableOpacity>
              {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
              
              {showDatePicker && (
                <>
                  {Platform.OS === 'ios' ? (
                    <View style={styles.iosDatePickerContainer}>
                      <View style={styles.iosDatePickerHeader}>
                        <TouchableOpacity onPress={handleDatePickerConfirm}>
                          <Text style={styles.iosDatePickerButton}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={dob instanceof Date && !isNaN(dob.getTime()) ? dob : new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        textColor={COLORS.primaryText}
                      />
                    </View>
                  ) : (
                    <DateTimePicker
                      value={dob instanceof Date && !isNaN(dob.getTime()) ? dob : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            </View>

            {/* Email Input (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Save Profile</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.mainBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  required: {
    color: COLORS.red,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.primaryText,
    borderWidth: 1.5,
    borderColor: COLORS.darkGray,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  pickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  genderPicker: {
    marginTop: 8,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.darkGray,
    overflow: 'hidden',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGray,
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(51, 204, 255, 0.1)',
  },
  genderOptionText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
  genderOptionTextSelected: {
    color: COLORS.accentGlow,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: COLORS.actionButton,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.actionButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
    textDecorationLine: 'underline',
  },
  iosDatePickerContainer: {
    marginTop: 8,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.darkGray,
    overflow: 'hidden',
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGray,
  },
  iosDatePickerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accentGlow,
  },
});

