import { guardsApi } from '@/services/api';
import { Booking } from '@/services/api/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
    red: '#EF4444',
    white: '#FFFFFF',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    darkGray: '#1F2937',
    green: '#10B981',
    blue: '#3B82F6',
    yellow: '#F59E0B',
    borderGray: '#E5E7EB',
};

export default function BookingsScreen() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await guardsApi.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        loadBookings();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return COLORS.green;
            case 'active':
            case 'accepted': return COLORS.blue;
            case 'pending': return COLORS.yellow;
            case 'cancelled': return COLORS.red;
            default: return COLORS.gray;
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderBookingItem = ({ item }: { item: Booking }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            activeOpacity={0.7}
            disabled={true} // For now just display
        >
            <View style={styles.cardHeader}>
                <View style={styles.bookingIdContainer}>
                    <Text style={styles.bookingIdLabel}>Booking ID</Text>
                    <Text style={styles.bookingId}>#{item.id.slice(-8).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="security" size={18} color={COLORS.gray} />
                    <Text style={styles.infoLabel}>Protection Type:</Text>
                    <Text style={styles.infoValue}>{item.protectionType.charAt(0).toUpperCase() + item.protectionType.slice(1)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="event" size={18} color={COLORS.gray} />
                    <Text style={styles.infoLabel}>Date & Time:</Text>
                    <Text style={styles.infoValue}>{formatDate(item.createdAt)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="person" size={18} color={COLORS.gray} />
                    <Text style={styles.infoLabel}>Guard:</Text>
                    <Text style={styles.infoValue}>{item.guardName}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.paymentInfo}>
                        <Ionicons name="card-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.paymentMethod}>Payment Completed</Text>
                    </View>
                    <Text style={styles.totalAmount}>{formatCurrency(item.cost || 0)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.darkGray} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={styles.placeholder} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                    <Text style={styles.loadingText}>Fetching your bookings...</Text>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[COLORS.red]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <MaterialIcons name="event-busy" size={60} color={COLORS.gray} />
                            </View>
                            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
                            <Text style={styles.emptySubtitle}>
                                You haven't requested any guards yet. Your booking history will appear here.
                            </Text>
                            <TouchableOpacity
                                style={styles.bookNowButton}
                                onPress={() => router.replace('/(tabs)')}
                            >
                                <Text style={styles.bookNowButtonText}>REQUEST A GUARD</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderGray,
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: COLORS.gray,
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    bookingCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderGray,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    bookingIdContainer: {
        gap: 2,
    },
    bookingIdLabel: {
        fontSize: 10,
        color: COLORS.gray,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    bookingId: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.darkGray,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    cardContent: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 12,
    },
    infoLabel: {
        fontSize: 13,
        color: COLORS.gray,
        width: 100,
    },
    infoValue: {
        flex: 1,
        fontSize: 13,
        color: COLORS.darkGray,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginVertical: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paymentMethod: {
        fontSize: 12,
        color: COLORS.gray,
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.darkGray,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.borderGray,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    bookNowButton: {
        backgroundColor: COLORS.red,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: COLORS.red,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookNowButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
