import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterModal } from '@/components/FilterModal';
import { useApp } from '@/contexts/AppContext';
import { SearchFilters } from '@/types';
import { 
  Plus, 
  MapPin, 
  Home, 
  Sofa, 
  Smartphone, 
  Car, 
  Briefcase 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ForSaleScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'sale',
    minPrice: undefined,
    maxPrice: undefined,
    city: undefined,
    neighborhood: undefined,
    bedrooms: undefined,
    amenities: [],
  });
  const { properties, user } = useApp();
  const router = useRouter();

  const allCategory = { id: 'all', name: 'All Items', color: '#6B7280' };
  
  const scrollableCategories = [
    { id: 'land', name: 'Lands', color: '#16A34A' },
    { id: 'house', name: 'Houses', color: '#3B82F6' },
    { id: 'furniture', name: 'Furniture', color: '#A855F7' },
    { id: 'electronics', name: 'Electronics', color: '#F59E0B' },
    { id: 'vehicles', name: 'Vehicles', color: '#EF4444' },
    { id: 'business', name: 'Business', color: '#10B981' },
  ];

  // Mock sell items data - in a real app, this would come from API
  const mockSellItems = [
    {
      id: 'sell-1',
      title: 'MacBook Pro 13 inch',
      description: 'Excellent condition laptop',
      price: 850000,
      category: 'electronics',
      type: 'sell-item',
      images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400'],
      location: 'Yaoundé, Bastos',
    },
    {
      id: 'sell-2',
      title: 'Toyota Camry 2018',
      description: 'Well maintained vehicle',
      price: 12000000,
      category: 'vehicles',
      type: 'sell-item',
      images: ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400'],
      location: 'Douala, Akwa',
    },
    {
      id: 'sell-3',
      title: 'Dining Table Set',
      description: '6-seater wooden dining set',
      price: 120000,
      category: 'furniture',
      type: 'sell-item',
      images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'],
      location: 'Yaoundé, Mfandena',
    }
  ];

  // Combine properties and sell items
  const allItems = [
    ...properties.filter(property => property.type === 'sale').map(p => ({...p, category: p.type === 'sale' ? (p.bedrooms > 0 ? 'house' : 'land') : 'house'})),
    ...mockSellItems
  ];

  const filteredItems = allItems
    .filter(item => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (item.type === 'sell-item' && item.category !== selectedCategory) return false;
        if (item.type === 'sale' && selectedCategory === 'house' && item.category !== 'house') return false;
        if (item.type === 'sale' && selectedCategory === 'land' && item.category !== 'land') return false;
        if (item.type === 'sale' && !['house', 'land'].includes(selectedCategory)) return false;
      }
      
      // Additional filters from modal (only apply to properties)
      if (item.type === 'sale') {
        if (filters.minPrice && item.price < filters.minPrice) return false;
        if (filters.maxPrice && item.price > filters.maxPrice) return false;
        if (filters.city && item.city !== filters.city) return false;
        if (filters.neighborhood && item.neighborhood !== filters.neighborhood) return false;
        if (filters.bedrooms !== undefined && item.bedrooms !== filters.bedrooms) return false;
        
        // Amenities filter
        if (filters.amenities && filters.amenities.length > 0) {
          const hasAllAmenities = filters.amenities.every(requiredAmenity => {
            return item.amenities.some(amenity => {
              return amenity.name === requiredAmenity && amenity.available;
            });
          });
          if (!hasAllAmenities) return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime());

  const handleAddProperty = () => {
    router.push('/add-property');
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    // Force type to be 'sale' for this page
    setFilters({ ...newFilters, type: 'sale' });
  };

  const handleBackPress = () => {
    // Reset to default filters and category
    setFilters({
      type: 'sale',
      minPrice: undefined,
      maxPrice: undefined,
      city: undefined,
      neighborhood: undefined,
      bedrooms: undefined,
      amenities: [],
    });
    setSelectedCategory('all');
  };

  const hasActiveFilters = () => {
    return filters.minPrice !== undefined ||
           filters.maxPrice !== undefined ||
           filters.city !== undefined ||
           filters.neighborhood !== undefined ||
           filters.bedrooms !== undefined ||
           (filters.amenities && filters.amenities.length > 0) ||
           selectedCategory !== 'all';
  };

  const renderCategoryItem = (item: typeof allCategory, isFixed = false) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.categoryItem,
          isFixed && styles.fixedCategoryItem,
          isSelected && { 
            backgroundColor: item.color,
            borderColor: item.color 
          }
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={[
          styles.categoryText,
          isSelected && { color: '#FFFFFF', fontWeight: '600' }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderScrollableCategoryItem = ({ item }: { item: typeof scrollableCategories[0] }) => {
    return renderCategoryItem(item, false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Properties for Sale
        </Text>
        <Text style={styles.subtitle}>Find your perfect investment</Text>
      </View>

      <SearchBar 
        onFilterPress={handleFilterPress}
        showBackButton={hasActiveFilters()}
        onBackPress={handleBackPress}
      />

      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesLayout}>
          {/* Fixed "All Items" category */}
          <View style={styles.fixedCategoryContainer}>
            {renderCategoryItem(allCategory, true)}
          </View>
          
          {/* Scrollable other categories */}
          <FlatList
            data={scrollableCategories}
            renderItem={renderScrollableCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollableCategoriesList}
            style={styles.scrollableCategories}
          />
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => {
          if (item.type === 'sell-item') {
            return (
              <TouchableOpacity 
                style={styles.sellItemCard}
                onPress={() => router.push(`/sell-item-detail/${item.id}`)}
              >
                <View style={styles.sellItemContent}>
                  <Text style={styles.sellItemTitle}>{item.title}</Text>
                  <Text style={styles.sellItemPrice}>
                    {item.price.toLocaleString()} FCFA
                  </Text>
                  <Text style={styles.sellItemLocation}>{item.location}</Text>
                  <Text style={styles.sellItemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return <PropertyCard property={item} />;
        }}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or category</Text>
          </View>
        }
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
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
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
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesLayout: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  fixedCategoryContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  fixedCategoryItem: {
    // Any specific styling for the fixed category if needed
  },
  scrollableCategories: {
    flex: 1,
  },
  scrollableCategoriesList: {
    paddingRight: 16,
    gap: 8,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  sellItemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sellItemContent: {
    gap: 4,
  },
  sellItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sellItemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  sellItemLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  sellItemDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 18,
  },
});