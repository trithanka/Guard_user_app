import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  TextInput,
  TouchableOpacity, 
  View, 
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authApi } from '@/services/api';
import { ApiError } from '@/services/api/client';

const COLORS = {
  red: '#EF4444',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#1F2937',
  yellow: '#FBBF24',
  borderGray: '#E5E7EB',
};

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  subtitle?: string;
}

const menuItems: MenuItem[] = [
  { id: 'safety', title: 'Safety', icon: 'verified-user' },
  { id: 'my-bookings', title: 'My Bookings', icon: 'event-note' },
  { id: 'payment', title: 'Payment', icon: 'account-balance-wallet' },
  { id: 'refer', title: 'Refer & Earn', icon: 'card-giftcard' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications-none' },
  { id: 'help', title: 'Help & Support', icon: 'help-outline' },
  { id: 'settings', title: 'Settings', icon: 'settings' },
  { id: 'terms', title: 'Terms & Privacy', icon: 'privacy-tip' },
  { id: 'become-guard', title: 'Become a Guard', icon: 'security' },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function ProfileScreen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    gender: '',
    dob: null as Date | null,
  });
  
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    gender?: string;
    dob?: string;
  }>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoadingProfile(true);
    try {
      console.log('=== Fetching Profile Data ===');
      console.log('API Endpoint: GET /api/user/profile');
      
      const user = await authApi.getCurrentUser();
      
      console.log('Profile data received:', {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: (user as any).phoneNumber,
        gender: (user as any).gender,
        dob: (user as any).dob,
      });
      
      // Update profile data with API response
      // API returns: phoneNumber, not phone
      setProfileData({
        name: user.name || '',
        phone: (user as any).phoneNumber || user.phone || '',
        email: user.email || '',
        gender: (user as any).gender || '',
        dob: (user as any).dob || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      // Keep empty state on error
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleMenuItemPress = (itemId: string) => {
    // TODO: Implement navigation to specific screens
    console.log('Navigate to:', itemId);
  };

  const handleEditProfile = () => {
    // Parse existing DOB if available
    let parsedDob: Date | null = null;
    if (profileData.dob) {
      // Try to parse date in DD/MM/YYYY format
      const dateParts = profileData.dob.split('/');
      if (dateParts.length === 3) {
        parsedDob = new Date(
          parseInt(dateParts[2]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[0])
        );
      } else {
        // Try ISO format
        parsedDob = new Date(profileData.dob);
      }
      if (isNaN(parsedDob.getTime())) {
        parsedDob = null;
      }
    }

    setEditForm({
      name: profileData.name,
      email: profileData.email,
      gender: profileData.gender,
      dob: parsedDob,
    });
    setShowEditModal(true);
    setErrors({});
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
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setEditForm({ ...editForm, dob: selectedDate });
      if (errors.dob) {
        setErrors({ ...errors, dob: undefined });
      }
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!editForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (editForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updateData: {
        name?: string;
        gender?: string;
        dob?: string;
        email?: string;
      } = {};

      if (editForm.name.trim()) {
        updateData.name = editForm.name.trim();
      }
      if (editForm.gender) {
        updateData.gender = editForm.gender;
      }
      if (editForm.dob) {
        updateData.dob = formatDateForAPI(editForm.dob);
      }
      if (editForm.email.trim()) {
        updateData.email = editForm.email.trim();
      }

      const updatedUser = await authApi.updateProfile(updateData);
      
      // Update local state with API response
      // API returns: phoneNumber, not phone
      setProfileData({
        name: updatedUser.name || profileData.name,
        phone: (updatedUser as any).phoneNumber || updatedUser.phone || profileData.phone,
        email: updatedUser.email || '',
        gender: (updatedUser as any).gender || '',
        dob: (updatedUser as any).dob || '',
      });
      
      // Reload profile data to ensure we have the latest
      await loadUserData();

      Alert.alert('Success', 'Profile updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      console.error('Update profile error:', error);
      if (error instanceof ApiError) {
        Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
      } else {
        Alert.alert('Network Error', 'Unable to connect. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {isLoadingProfile ? (
            <View style={styles.profileInfo}>
              <View style={styles.profileIconContainer}>
                <MaterialIcons name="person" size={40} color={COLORS.gray} />
              </View>
              <View style={styles.profileDetails}>
                <ActivityIndicator size="small" color={COLORS.gray} style={{ marginBottom: 8 }} />
                <Text style={styles.profilePhone}>Loading profile...</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.profileInfo} 
              activeOpacity={0.7}
              onPress={handleEditProfile}
            >
              <View style={styles.profileIconContainer}>
                <MaterialIcons name="person" size={40} color={COLORS.gray} />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                  {profileData.name || 'User'}
                </Text>
                <Text style={styles.profilePhone}>
                  {profileData.phone || 'No phone number'}
                </Text>
                <Text style={styles.verifiedText}>verified user</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon} size={24} color={COLORS.darkGray} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalCloseButton}
                >
                  <MaterialIcons name="close" size={24} color={COLORS.darkGray} />
                </TouchableOpacity>
              </View>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.gray}
                  value={editForm.name}
                  onChangeText={(text) => {
                    setEditForm({ ...editForm, name: text });
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity
                  style={[styles.input, styles.pickerInput, errors.gender && styles.inputError]}
                  onPress={() => setShowGenderPicker(!showGenderPicker)}
                >
                  <Text style={[styles.pickerText, !editForm.gender && styles.placeholderText]}>
                    {editForm.gender || 'Select gender'}
                  </Text>
                  <MaterialIcons
                    name={showGenderPicker ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={COLORS.darkGray}
                  />
                </TouchableOpacity>
                {showGenderPicker && (
                  <View style={styles.genderPicker}>
                    {GENDER_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.genderOption,
                          editForm.gender === option && styles.genderOptionSelected,
                        ]}
                        onPress={() => {
                          setEditForm({ ...editForm, gender: option });
                          setShowGenderPicker(false);
                          if (errors.gender) {
                            setErrors({ ...errors, gender: undefined });
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.genderOptionText,
                            editForm.gender === option && styles.genderOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {editForm.gender === option && (
                          <MaterialIcons name="check" size={20} color={COLORS.red} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>

              {/* Date of Birth Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={[styles.input, styles.pickerInput, errors.dob && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.pickerText, !editForm.dob && styles.placeholderText]}>
                    {editForm.dob ? formatDate(editForm.dob) : 'Select date of birth'}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color={COLORS.darkGray} />
                </TouchableOpacity>
                {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
                
                {showDatePicker && (
                  <>
                    {Platform.OS === 'ios' ? (
                      <View style={styles.iosDatePickerContainer}>
                        <View style={styles.iosDatePickerHeader}>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.iosDatePickerButton}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={editForm.dob instanceof Date && !isNaN(editForm.dob.getTime()) ? editForm.dob : new Date()}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          maximumDate={new Date()}
                        />
                      </View>
                    ) : (
                      <DateTimePicker
                        value={editForm.dob instanceof Date && !isNaN(editForm.dob.getTime()) ? editForm.dob : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                      />
                    )}
                  </>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.gray}
                  value={editForm.email}
                  onChangeText={(text) => {
                    setEditForm({ ...editForm, email: text });
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 14,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  profilePhone: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.gray,
    fontWeight: '400',
  },
  menuContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  modalCloseButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.darkGray,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
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
    color: COLORS.darkGray,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  genderPicker: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    overflow: 'hidden',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.lightGray,
  },
  genderOptionText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  genderOptionTextSelected: {
    color: COLORS.red,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  iosDatePickerContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    overflow: 'hidden',
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  iosDatePickerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.red,
  },
});

