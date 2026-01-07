import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  blue: '#3B82F6',
  red: '#EF4444',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#1F2937',
  blueLight: '#EFF6FF',
  blueDark: '#2563EB',
  grayLight: '#F9FAFB',
  grayBorder: '#E5E7EB',
};

type ProtectionType = 'personal' | 'escort' | 'standby';

export const GuardRequestForm: React.FC = () => {
  const [protectionType, setProtectionType] = useState<ProtectionType>('personal');

  const handleRequestGuard = () => {
    // TODO: Implement guard request logic
    console.log('Request guard:', { protectionType });
  };

  return (
    <View style={styles.container}>
      {/* Need Protection Section */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Need Protection Right Now?</Text>
          <Text style={styles.heroSubtitle}>Get instant security guard service</Text>
        </View>

        {/* Protection Type Options inside Hero Card */}
        <View style={styles.optionsRowInside}>
          <TouchableOpacity
            style={[
              styles.protectionOption,
              protectionType === 'personal' && styles.protectionOptionActive,
            ]}
            onPress={() => setProtectionType('personal')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={protectionType === 'personal' ? COLORS.blue : COLORS.darkGray}
            />
            <Text
              style={[
                styles.optionText,
                protectionType === 'personal' && styles.optionTextActive
              ]}
              numberOfLines={1}
            >
              Personal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.protectionOption,
              protectionType === 'escort' && styles.protectionOptionActive,
            ]}
            onPress={() => setProtectionType('escort')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="directions-car"
              size={24}
              color={protectionType === 'escort' ? COLORS.blue : COLORS.darkGray}
            />
            <Text
              style={[
                styles.optionText,
                protectionType === 'escort' && styles.optionTextActive
              ]}
              numberOfLines={1}
            >
              Escort / Travel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.protectionOption,
              protectionType === 'standby' && styles.protectionOptionActive,
            ]}
            onPress={() => setProtectionType('standby')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="schedule"
              size={24}
              color={protectionType === 'standby' ? COLORS.blue : COLORS.darkGray}
            />
            <Text
              style={[
                styles.optionText,
                protectionType === 'standby' && styles.optionTextActive
              ]}
              numberOfLines={1}
            >
              Standby
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>REQUEST GUARD NOW</Text>
        </TouchableOpacity>
        <View style={styles.etaContainer}>
          <MaterialIcons name="schedule" size={16} color={COLORS.blue} />
          <Text style={styles.etaText}>ETA: 8 min away</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayLight,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroContent: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '400',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  etaText: {
    fontSize: 14,
    color: COLORS.blue,
    fontWeight: '600',
  },
  optionsRowInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 16,
  },
  protectionOption: {
    flex: 1,
    minHeight: 70,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  protectionOptionActive: {
    borderWidth: 2,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.blueLight,
  },
  optionText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 6,
  },
  optionTextActive: {
    color: COLORS.blue,
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 5,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  paymentOptionActive: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.blueLight,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  paymentTextActive: {
    color: COLORS.blue,
    fontWeight: '700',
  },
  requestButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  requestButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

