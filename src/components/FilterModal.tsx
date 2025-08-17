import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions } from '../types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const CITIES = ['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'];
const AMENITIES = ['Electricity', 'Water', 'WiFi', 'Parking', 'Security', 'Generator', 'Air Conditioning'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || { type: 'all' }
  );

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ type: 'all' });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Property Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Type</Text>
            <View style={styles.typeButtons}>
              {['all', 'rent', 'sale'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    filters.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFilters({ ...filters, type: type as any })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      filters.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type === 'all' ? 'All' : type === 'rent' ? 'For Rent' : 'For Sale'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range (FCFA)</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min price"
                value={filters.minPrice?.toString() || ''}
                onChangeText={(text) =>
                  setFilters({
                    ...filters,
                    minPrice: text ? parseInt(text) : undefined,
                  })
                }
                keyboardType="numeric"
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max price"
                value={filters.maxPrice?.toString() || ''}
                onChangeText={(text) =>
                  setFilters({
                    ...filters,
                    maxPrice: text ? parseInt(text) : undefined,
                  })
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* City */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>City</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cityButtons}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityButton,
                      filters.city === city && styles.cityButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        city: filters.city === city ? undefined : city,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.cityButtonText,
                        filters.city === city && styles.cityButtonTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Bedrooms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bedrooms</Text>
            <View style={styles.bedroomButtons}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.bedroomButton,
                    filters.bedrooms === num && styles.bedroomButtonActive,
                  ]}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      bedrooms: filters.bedrooms === num ? undefined : num,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.bedroomButtonText,
                      filters.bedrooms === num && styles.bedroomButtonTextActive,
                    ]}
                  >
                    {num}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resetText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
  },
  cityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cityButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  cityButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  cityButtonTextActive: {
    color: '#fff',
  },
  bedroomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bedroomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bedroomButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  bedroomButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  bedroomButtonTextActive: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});