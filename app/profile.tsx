import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function ProfileScreen() {
  const handleMenuItemPress = (itemId: string) => {
    // TODO: Implement navigation to specific screens
    console.log('Navigate to:', itemId);
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
          <TouchableOpacity style={styles.profileInfo} activeOpacity={0.7}>
            <View style={styles.profileIconContainer}>
              <MaterialIcons name="person" size={40} color={COLORS.gray} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Saurav Rai</Text>
              <Text style={styles.profilePhone}>7636854312</Text>
              <Text style={styles.verifiedText}>verified user</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
          </TouchableOpacity>
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
});

