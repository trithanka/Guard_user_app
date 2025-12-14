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
type PaymentMethod = 'upi' | 'card' | 'custom';

export const GuardRequestForm: React.FC = () => {
  const [protectionType, setProtectionType] = useState<ProtectionType>('personal');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const handleRequestGuard = () => {
    // TODO: Implement guard request logic
    console.log('Request guard:', { protectionType, paymentMethod });
  };

  return (
    <View style={styles.container}>
      {/* Need Protection Section */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Need Protection Right Now?</Text>
          <Text style={styles.heroSubtitle}>Get instant security guard service</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>REQUEST GUARD NOW</Text>
        </TouchableOpacity>
        <View style={styles.etaContainer}>
          <MaterialIcons name="schedule" size={16} color={COLORS.blue} />
          <Text style={styles.etaText}>ETA: 8 min</Text>
        </View>
      </View>

      {/* Protection Type Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How do you need protection?</Text>
        <View style={styles.optionsRow}>
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
               size={28} 
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
               size={28} 
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
               size={28} 
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
      </View>

      {/* Payment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'upi' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('upi')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="account-balance-wallet" 
              size={20} 
              color={paymentMethod === 'upi' ? COLORS.blue : COLORS.gray} 
            />
            <Text style={[styles.paymentText, paymentMethod === 'upi' && styles.paymentTextActive]}>
              UPI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="credit-card" 
              size={20} 
              color={paymentMethod === 'card' ? COLORS.blue : COLORS.gray} 
            />
            <Text style={[styles.paymentText, paymentMethod === 'card' && styles.paymentTextActive]}>
              Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'custom' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('custom')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="handshake" 
              size={20} 
              color={paymentMethod === 'custom' ? COLORS.blue : COLORS.gray} 
            />
            <Text style={[styles.paymentText, paymentMethod === 'custom' && styles.paymentTextActive]}>
              Pay in Hand
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Request Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.requestButton} 
          onPress={handleRequestGuard}
          activeOpacity={0.8}
        >
          <Text style={styles.requestButtonText}>
            REQUEST {protectionType === 'personal' ? 'PERSONAL' : protectionType === 'escort' ? 'ESCORT' : 'STANDBY'} GUARD
          </Text>
        </TouchableOpacity>
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  protectionOption: {
    flex: 1,
    minHeight: 80,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.grayBorder,
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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

