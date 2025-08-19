import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { X, MapPin, DollarSign, Bed } from 'lucide-react-native';
import { SearchFilters } from '@/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<SearchFilters>(currentFilters);

  const applyFilters = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetFilters: SearchFilters = { type: 'all' };
    setTempFilters(resetFilters);
  };

  const cities = ['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam'];
  const amenityOptions = ['Electricity', 'Water', 'WiFi', 'Kitchen', 'Air Conditioning', 'Parking'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Property Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Property Type</Text>
            <View style={styles.typeButtons}>
              {[
                { key: 'all', label: 'All' },
                { key: 'rent', label: 'For Rent' },
                { key: 'sale', label: 'For Sale' }
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    tempFilters.type === type.key && styles.typeButtonActive
                  ]}
                  onPress={() => setTempFilters(prev => ({ 
                    ...prev, 
                    type: type.key as 'all' | 'rent' | 'sale' 
                  }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    tempFilters.type === type.key && styles.typeButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Range (FCFA)</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInputContainer}>
                <DollarSign size={16} color="#6B7280" />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={tempFilters.minPrice?.toString() || ''}
                  onChangeText={(text) => setTempFilters(prev => ({ 
                    ...prev, 
                    minPrice: text ? parseInt(text) : undefined 
                  }))}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text style={styles.priceDash}>-</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={16} color="#6B7280" />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={tempFilters.maxPrice?.toString() || ''}
                  onChangeText={(text) => setTempFilters(prev => ({ 
                    ...prev, 
                    maxPrice: text ? parseInt(text) : undefined 
                  }))}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>City</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cityButtons}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityButton,
                      tempFilters.city === city && styles.cityButtonActive
                    ]}
                    onPress={() => setTempFilters(prev => ({ 
                      ...prev, 
                      city: prev.city === city ? undefined : city 
                    }))}
                  >
                    <MapPin size={16} color={tempFilters.city === city ? '#3B82F6' : '#6B7280'} />
                    <Text style={[
                      styles.cityButtonText,
                      tempFilters.city === city && styles.cityButtonTextActive
                    ]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Bedrooms */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Minimum Bedrooms</Text>
            <View style={styles.bedroomButtons}>
              {[1, 2, 3, 4].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.bedroomButton,
                    tempFilters.bedrooms === num && styles.bedroomButtonActive
                  ]}
                  onPress={() => setTempFilters(prev => ({ 
                    ...prev, 
                    bedrooms: prev.bedrooms === num ? undefined : num 
                  }))}
                >
                  <Bed size={16} color={tempFilters.bedrooms === num ? '#3B82F6' : '#6B7280'} />
                  <Text style={[
                    styles.bedroomButtonText,
                    tempFilters.bedrooms === num && styles.bedroomButtonTextActive
                  ]}>
                    {num}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Required Amenities</Text>
            <View style={styles.amenityGrid}>
              {amenityOptions.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityButton,
                    tempFilters.amenities?.includes(amenity) && styles.amenityButtonActive
                  ]}
                  onPress={() => {
                    const currentAmenities = tempFilters.amenities || [];
                    const newAmenities = currentAmenities.includes(amenity)
                      ? currentAmenities.filter(a => a !== amenity)
                      : [...currentAmenities, amenity];
                    setTempFilters(prev => ({ ...prev, amenities: newAmenities }));
                  }}
                >
                  <Text style={[
                    styles.amenityButtonText,
                    tempFilters.amenities?.includes(amenity) && styles.amenityButtonTextActive
                  ]}>
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  resetText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#3B82F6',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  priceDash: {
    fontSize: 16,
    color: '#6B7280',
  },
  cityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  cityButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  cityButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cityButtonTextActive: {
    color: '#3B82F6',
  },
  bedroomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bedroomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  bedroomButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  bedroomButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bedroomButtonTextActive: {
    color: '#3B82F6',
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amenityButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  amenityButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  amenityButtonTextActive: {
    color: '#3B82F6',
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});