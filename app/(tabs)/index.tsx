import { GuardRequestForm } from '@/components/GuardRequestForm';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { ServicesView } from '@/components/ServicesView';
import { LocationMap } from '@/components/map/LocationMap';
import { getLocationData, LocationCoords, requestLocationPermission } from '@/services/locationService';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% of screen height - reduced to show more content

// Color scheme
const COLORS = {
  red: '#EF4444',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#1F2937',
};

type ViewType = 'map' | 'services';

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationText, setLocationText] = useState('Mondeal Square, Prahlad Nagar, Ahmea...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const params = useLocalSearchParams();
  const isNewLogin = params.newLogin === 'true';

  // Request location permission and get current location
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoadingLocation(true);
      const locationData = await getLocationData();
      
      if (locationData) {
        setUserLocation(locationData.coordinates);
        setLocationPermission(true);
        if (locationData.address) {
          setLocationText(locationData.address);
        }
      } else {
        setLocationPermission(false);
      }
      
      setIsLoadingLocation(false);
    };

    fetchLocation();
  }, []);

  const handleRetryPermission = async () => {
    setIsLoadingLocation(true);
    const permissionResult = await requestLocationPermission();
    
    if (permissionResult.granted) {
      const locationData = await getLocationData();
      if (locationData) {
        setUserLocation(locationData.coordinates);
        setLocationPermission(true);
        if (locationData.address) {
          setLocationText(locationData.address);
        }
      }
    } else {
      setLocationPermission(false);
    }
    
    setIsLoadingLocation(false);
  };

  useEffect(() => {
    // Show profile modal if user just logged in AND doesn't have a name
    if (isNewLogin) {
      const checkUserProfile = async () => {
        try {
          // Wait a bit for token to be stored
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user has a name by fetching profile
          const { authApi } = await import('@/services/api');
          const user = await authApi.getCurrentUser();
          
          console.log('User profile check:', {
            name: user.name,
            phoneNumber: (user as any).phoneNumber,
            hasName: !!(user.name && user.name.trim() !== ''),
          });
          
          // Only show modal if user doesn't have a name (name is null or empty)
          if (!user.name || user.name.trim() === '') {
            console.log('User has no name, showing profile setup modal');
            setShowProfileModal(true);
          } else {
            console.log('User already has name:', user.name, '- skipping profile modal');
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
          // If error, show modal anyway (user might not be authenticated yet)
          setShowProfileModal(true);
        }
      };
      
      checkUserProfile();
    }
  }, [isNewLogin]);

  const handleProfileSubmit = (profileData: {
    name: string;
    gender: string;
    dob: string;
    email?: string;
  }) => {
    // Profile data is already saved to backend via API in ProfileSetupModal
    console.log('Profile setup completed:', profileData);
    
    // Update user name in header if available
    // You can store this in state or context for global access
    
    // Modal will close automatically after successful API call
    setShowProfileModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
        {/* Conditional Content */}
        {currentView === 'map' ? (
          <>
            {/* Location Search Filter */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <MaterialIcons name="search" size={24} color={COLORS.gray} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search location or address"
                  placeholderTextColor={COLORS.gray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    // TODO: Implement search functionality
                    console.log('Searching for:', searchQuery);
                  }}
                />
                <TouchableOpacity 
                  onPress={() => {
                    // TODO: Implement filter functionality
                    console.log('Open filters');
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="tune" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Content with Parallax Map */}
          <View style={styles.scrollContainer}>
            {/* Parallax Map Section */}
            <Animated.View
              style={[
                styles.mapWrapper,
                {
                  height: scrollY.interpolate({
                    inputRange: [0, MAP_HEIGHT],
                    outputRange: [MAP_HEIGHT, 0],
                    extrapolate: 'clamp',
                  }),
                  opacity: scrollY.interpolate({
                    inputRange: [0, MAP_HEIGHT * 0.5],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
              pointerEvents={scrollPosition < 20 ? 'auto' : 'none'}
            >
              <LocationMap
                userLocation={userLocation}
                isLoading={isLoadingLocation}
                hasPermission={locationPermission}
                onRetryPermission={handleRetryPermission}
              />
            </Animated.View>

            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: { y: scrollY },
                    },
                  },
                ],
                {
                  useNativeDriver: false,
                  listener: (event: any) => {
                    const offset = event.nativeEvent.contentOffset.y;
                    setScrollPosition(offset);
                  },
                }
              )}
              contentInsetAdjustmentBehavior="never"
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              bounces={true}
            >
              {/* Spacer to push content below map - starts exactly where map ends */}
              <View style={{ height: MAP_HEIGHT }} />
              
              {/* Guard Request Form */}
              <GuardRequestForm />
            </Animated.ScrollView>
          </View>
        </>
      ) : (
        <ServicesView locationText={locationText} />
      )}

      {/* Bottom Navigation */}
      <SafeAreaView edges={['bottom']} style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => {
              setCurrentView('map');
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="home" size={24} color={currentView === 'map' ? COLORS.red : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'map' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => {
              setCurrentView('services');
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="security" size={24} color={currentView === 'services' ? COLORS.red : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'services' && styles.navLabelActive]}>Services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sosButton}>
            <View style={styles.sosButtonInner}>
              <Ionicons name="warning" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sosLabel}>SOS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="event-note" size={24} color={COLORS.gray} />
            <Text style={styles.navLabel}>Bookings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="person" size={24} color={COLORS.gray} />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSubmit={handleProfileSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '400',
    paddingVertical: 2,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: 0, // No margin needed as bottom nav is absolute
  },
  mapWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 2,
    overflow: 'hidden',
  },
  mapTouchArea: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 95,
    backgroundColor: 'transparent',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    zIndex: 1000,
    elevation: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    paddingVertical: 4,
    zIndex: 1001,
  },
  navLabel: {
    fontSize: 9,
    color: COLORS.gray,
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.red,
    fontWeight: '600',
  },
  sosButton: {
    alignItems: 'center',
    marginTop: -20,
    gap: 4,
  },
  sosButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 4,
  },
});

