import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  mainBackground: '#12122A',
  primaryText: '#E0E7FF',
  accentGlow: '#33CCFF',
  inputBackground: '#1C1C35',
  actionButton: '#00A3FF',
  red: '#EF4444',
  yellow: '#FBBF24',
  blue: '#3B82F6',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

const services = [
  { id: 1, icon: 'security' as const, title: 'Personal Security Services', color: COLORS.red },
  { id: 2, icon: 'business-center' as const, title: 'Business/Office Guards', color: COLORS.blue },
  { id: 3, icon: 'home' as const, title: 'Apartment/Colony Guards', color: COLORS.yellow },
  { id: 4, icon: 'event' as const, title: 'Event Excel Security', color: COLORS.accentGlow },
  { id: 5, icon: 'directions-car' as const, title: 'Travel & Escort Guards', color: COLORS.actionButton },
  { id: 6, icon: 'person' as const, title: 'VIP/Executive Protection', color: COLORS.red },
];

const featuredGuards = [
  { id: 1, name: 'Armed Guards', distance: '2 km away', rating: null, image: null },
  { id: 2, name: '5.0 (1k) Rated Guard', distance: '2 km away', rating: 5.0, image: null },
  { id: 3, name: 'Close Protection', distance: '2 km away', rating: null, image: null },
  { id: 4, name: 'Close Protection', distance: '2 km away', rating: null, image: null },
];

const heroBanners = [
  { 
    id: 1, 
    title: 'ON-DEMAND BODYGUARD', 
    subtitle: 'Hire trusted security guards anytime, anywhere. Fast & Easy Booking.',
    backgroundColor: COLORS.yellow,
    icon: 'security' as const,
  },
  { 
    id: 2, 
    title: '24/7 SECURITY SERVICE', 
    subtitle: 'Professional guards available round the clock for your safety.',
    backgroundColor: COLORS.blue,
    icon: 'check-circle' as const,
  },
  { 
    id: 3, 
    title: 'INSTANT BOOKING', 
    subtitle: 'Book a guard in minutes with our quick and easy process.',
    backgroundColor: COLORS.accentGlow,
    icon: 'alarm' as const,
  },
];

interface ServicesViewProps {
  locationText?: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ locationText = 'Mondeal Square, Prahlad Nagar, Ahmea...' }) => {
  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Hero Banner - Horizontal Scrolling */}
      <View style={styles.heroBannerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.heroBannerScroll}
          pagingEnabled
          snapToInterval={width - 60}
          decelerationRate="fast"
          scrollEventThrottle={16}
          bounces={true}
        >
          {heroBanners.map((banner) => (
            <View key={banner.id} style={[styles.heroBanner, { backgroundColor: banner.backgroundColor }]}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{banner.title}</Text>
                <Text style={styles.heroSubtitle}>
                  {banner.subtitle}
                </Text>
              </View>
              <View style={styles.heroImage}>
                <MaterialIcons 
                  name={banner.icon} 
                  size={50} 
                  color="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Book a Service Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Book a Service</Text>
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={16} color={COLORS.white} />
            <View style={styles.verifiedTextContainer}>
              <Text style={styles.verifiedText}>VERIFIED</Text>
              <Text style={styles.verifiedText}>CERTIFIED</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                  <MaterialIcons name={service.icon} size={36} color={service.color} />
                </View>
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Guards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Guards Near You</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guardsScroll}
          style={styles.guardsScrollContainer}
        >
          {featuredGuards.map((guard) => (
            <TouchableOpacity key={guard.id} style={styles.guardCard}>
              <View style={styles.guardImage}>
                <MaterialIcons name="person" size={40} color={COLORS.white} />
              </View>
              <Text style={styles.guardName}>{guard.name}</Text>
              {guard.rating && (
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={14} color={COLORS.yellow} />
                  <Text style={styles.ratingText}>{guard.rating}</Text>
                </View>
              )}
              <Text style={styles.guardDistance}>{guard.distance}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroBannerContainer: {
    marginBottom: 20,
    paddingLeft: 16,
    overflow: 'visible',
  },
  heroBannerScroll: {
    paddingRight: 16,
    gap: 12,
    alignItems: 'center',
  },
  heroBanner: {
    flexDirection: 'row',
    width: width - 60,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
    flexShrink: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 0.5,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  heroImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.2,
    marginBottom: 0,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 5,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedTextContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
    lineHeight: 10,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  serviceCard: {
    width: '31%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB', 
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceIconContainer: {
    marginBottom: 10,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 2,
  },
  guardsScrollContainer: {
    marginTop: 18,
  },
  guardsScroll: {
    paddingRight: 16,
    paddingLeft: 0,
    gap: 20,
  },
  guardCard: {
    alignItems: 'center',
    marginRight: 1,
    width: 100,
  },
  guardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  guardDistance: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

