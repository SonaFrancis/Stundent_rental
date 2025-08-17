import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';
import { FilterModal } from '../components/FilterModal';
import { propertyService } from '../services/propertyService';
import { Property, FilterOptions } from '../types';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const PropertyList: React.FC<{
  type: 'rent' | 'sale';
  navigation: any;
  searchQuery: string;
  filters: FilterOptions;
}> = ({ type, navigation, searchQuery, filters }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProperties = async () => {
    try {
      const filterOptions = { ...filters, type };
      let data: Property[];
      
      if (searchQuery.trim()) {
        data = await propertyService.searchProperties(searchQuery);
        data = data.filter(p => p.type === type);
      } else {
        data = await propertyService.getProperties(filterOptions);
      }
      
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [type, searchQuery, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  const renderProperty = ({ item, index }: { item: Property; index: number }) => (
    <PropertyCard
      property={item}
      onPress={() => navigation.navigate('PropertyDetails', { property: item })}
      style={{
        marginLeft: index % 2 === 0 ? 16 : 8,
        marginRight: index % 2 === 0 ? 8 : 16,
      }}
    />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      renderItem={renderProperty}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No properties found for {type === 'rent' ? 'rent' : 'sale'}
          </Text>
        </View>
      }
    />
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setShowFilterModal(true)}
      />
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#4F46E5' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen
          name="ForRent"
          options={{ tabBarLabel: 'For Rent' }}
        >
          {() => (
            <PropertyList
              type="rent"
              navigation={navigation}
              searchQuery={searchQuery}
              filters={filters}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="ForSale"
          options={{ tabBarLabel: 'For Sale' }}
        >
          {() => (
            <PropertyList
              type="sale"
              navigation={navigation}
              searchQuery={searchQuery}
              filters={filters}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});