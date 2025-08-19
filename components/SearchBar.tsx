import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  placeholder?: string;
  onFilterPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function SearchBar({ placeholder = 'Search properties...', onFilterPress, showBackButton = false, onBackPress }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    // Search functionality can be implemented here
    console.log('Search:', searchText);
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeft size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
      <View style={[styles.searchContainer, showBackButton && styles.searchContainerWithBack]}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <SlidersHorizontal size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  searchContainerWithBack: {
    marginRight: 0,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
});