import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal
} from 'react-native';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterModal } from '@/components/FilterModal';
import { NotificationModal } from '@/components/NotificationModal';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { SearchFilters } from '@/types';
import { Plus, X, Bell } from 'lucide-react-native';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'rent',
    minPrice: undefined,
    maxPrice: undefined,
    city: undefined,
    neighborhood: undefined,
    bedrooms: undefined,
    amenities: [],
  });
  const { properties, user } = useApp();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  const filteredProperties = properties
    .filter(property => {
      // Only show rental properties
      if (property.type !== 'rent') return false;
      
      // Additional filters from modal
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.neighborhood && property.neighborhood !== filters.neighborhood) return false;
      if (filters.bedrooms !== undefined && property.bedrooms !== filters.bedrooms) return false;
      
      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(requiredAmenity => {
          return property.amenities.some(amenity => {
            return amenity.name === requiredAmenity && amenity.available;
          });
        });
        if (!hasAllAmenities) return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddProperty = () => {
    // In a real app, this would navigate to an add property screen
    router.push('/add-property');
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    // Force type to be 'rent' for this page
    setFilters({ ...newFilters, type: 'rent' });
  };

  const handleBackPress = () => {
    // Reset to default filters
    setFilters({
      type: 'rent',
      minPrice: undefined,
      maxPrice: undefined,
      city: undefined,
      neighborhood: undefined,
      bedrooms: undefined,
      amenities: [],
    });
  };

  const hasActiveFilters = () => {
    return filters.minPrice !== undefined ||
           filters.maxPrice !== undefined ||
           filters.city !== undefined ||
           filters.neighborhood !== undefined ||
           filters.bedrooms !== undefined ||
           (filters.amenities && filters.amenities.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' }} 
              style={styles.profileImage} 
            />
            <View style={styles.textSection}>
              <Text style={styles.hiText}>
                Hi {user?.name?.split(' ')[0] || 'David'}
              </Text>
              <Text style={styles.greetingText}>
                {getGreeting()}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotificationModal(true)}
          >
            <Bell size={24} color="#1F2937" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Find your perfect rental home</Text>
      </View>

      <SearchBar 
        onFilterPress={handleFilterPress}
        showBackButton={hasActiveFilters()}
        onBackPress={handleBackPress}
      />

      <FlatList
        data={filteredProperties}
        renderItem={({ item }) => <PropertyCard property={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {user?.userType === 'landlord' && (
        <TouchableOpacity style={styles.fab} onPress={handleAddProperty}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  hiText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});