import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Plus, X } from 'lucide-react-native';

export default function AddPropertyScreen() {
  const { addProperty, user } = useApp();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'rent' as 'rent' | 'sale',
    price: '',
    city: '',
    neighborhood: '',
    streetName: '',
    houseName: '',
    bedrooms: '1',
    bathrooms: '1',
    squareMeters: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenityOptions = [
    { name: 'Electricity', icon: 'zap' },
    { name: 'Water', icon: 'droplets' },
    { name: 'WiFi', icon: 'wifi' },
    { name: 'Kitchen', icon: 'chef-hat' },
    { name: 'Air Conditioning', icon: 'snowflake' },
    { name: 'Parking', icon: 'car' },
  ];

  const cities = ['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Other'];

  const handleSubmit = () => {
    // Basic validation
    if (!formData.title || !formData.description || !formData.price || !formData.city) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newProperty = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      price: parseInt(formData.price),
      currency: 'XAF',
      city: formData.city,
      neighborhood: formData.neighborhood,
      streetName: formData.streetName,
      houseName: formData.houseName,
      images: [
        'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      amenities: amenityOptions.map((amenity, index) => ({
        id: (index + 1).toString(),
        name: amenity.name,
        icon: amenity.icon,
        available: selectedAmenities.includes(amenity.name),
      })),
      nearbyLandmarks: [
        { id: '1', name: 'University Campus', type: 'school' as const, distance: 500 },
        { id: '2', name: 'Local Hospital', type: 'hospital' as const, distance: 1000 },
      ],
      landlordId: user?.id || '2',
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      squareMeters: parseInt(formData.squareMeters) || 50,
      available: true,
    };

    addProperty(newProperty);
    Alert.alert('Success', 'Property added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const toggleAmenity = (amenityName: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityName)
        ? prev.filter(a => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Property</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Property Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Property Type *</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'rent' && styles.typeButtonActive]}
                onPress={() => setFormData(prev => ({ ...prev, type: 'rent' }))}
              >
                <Text style={[styles.typeButtonText, formData.type === 'rent' && styles.typeButtonTextActive]}>
                  For Rent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'sale' && styles.typeButtonActive]}
                onPress={() => setFormData(prev => ({ ...prev, type: 'sale' }))}
              >
                <Text style={[styles.typeButtonText, formData.type === 'sale' && styles.typeButtonTextActive]}>
                  For Sale
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.label}>Property Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Modern Studio Near University"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your property, its features, and what makes it special..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              Price * ({formData.type === 'rent' ? 'per month' : 'total'})
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 85000"
              value={formData.price}
              onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>City *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cityButtons}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityButton,
                      formData.city === city && styles.cityButtonActive
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, city }))}
                  >
                    <Text style={[
                      styles.cityButtonText,
                      formData.city === city && styles.cityButtonTextActive
                    ]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Neighborhood</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Ngoa-Ekélé"
                value={formData.neighborhood}
                onChangeText={(text) => setFormData(prev => ({ ...prev, neighborhood: text }))}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Street Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Rue de la Paix"
                value={formData.streetName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, streetName: text }))}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>House/Building Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Résidence Académique"
              value={formData.houseName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, houseName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Property Details */}
          <View style={styles.row}>
            <View style={styles.thirdWidth}>
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                value={formData.bedrooms}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bedrooms: text }))}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.thirdWidth}>
              <Text style={styles.label}>Bathrooms</Text>
              <TextInput
                style={styles.input}
                value={formData.bathrooms}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bathrooms: text }))}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.thirdWidth}>
              <Text style={styles.label}>Size (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="50"
                value={formData.squareMeters}
                onChangeText={(text) => setFormData(prev => ({ ...prev, squareMeters: text }))}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.label}>Available Amenities</Text>
            <View style={styles.amenityGrid}>
              {amenityOptions.map((amenity) => (
                <TouchableOpacity
                  key={amenity.name}
                  style={[
                    styles.amenityButton,
                    selectedAmenities.includes(amenity.name) && styles.amenityButtonActive
                  ]}
                  onPress={() => toggleAmenity(amenity.name)}
                >
                  <Text style={[
                    styles.amenityButtonText,
                    selectedAmenities.includes(amenity.name) && styles.amenityButtonTextActive
                  ]}>
                    {amenity.name}
                  </Text>
                  {selectedAmenities.includes(amenity.name) && (
                    <X size={14} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.submitSection}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Add Property</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  cityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
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
  submitSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});