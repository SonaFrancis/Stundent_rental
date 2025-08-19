import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  DollarSign,
  FileText,
  Building2,
  Phone,
  Plus,
  X,
  Home,
  Bath,
  Maximize,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplet,
  Wind,
  Navigation
} from 'lucide-react-native';

// Landmark Input Component
const LandmarkInput = ({ onAddLandmark }: { onAddLandmark: (landmark: string) => void }) => {
  const [landmarkText, setLandmarkText] = useState('');

  const handleAdd = () => {
    if (landmarkText.trim()) {
      onAddLandmark(landmarkText.trim());
      setLandmarkText('');
    }
  };

  return (
    <View style={styles.landmarkInputContainer}>
      <Navigation size={20} color="#6B7280" />
      <TextInput
        style={styles.landmarkInput}
        placeholder="e.g., University of Yaoundé, Central Hospital"
        value={landmarkText}
        onChangeText={setLandmarkText}
        placeholderTextColor="#9CA3AF"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={handleAdd}
        style={styles.addLandmarkButton}
      >
        <Plus size={16} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );
};

export default function PostPropertyScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    neighborhood: '',
    streetName: '',
    houseName: '',
    rooms: '',
    toilets: '',
    squareMeters: '',
    contactPhone: '',
    images: [] as string[],
    amenities: [] as string[],
    landmarks: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableAmenities = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'furnished', name: 'Furnished', icon: Building2 },
    { id: 'electricity', name: 'Electricity', icon: Zap },
    { id: 'water', name: 'Water Supply', icon: Droplet },
    { id: 'aircon', name: 'Air Conditioning', icon: Wind },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const addLandmark = (landmark: string) => {
    if (landmark.trim() && !formData.landmarks.includes(landmark.trim())) {
      setFormData(prev => ({
        ...prev,
        landmarks: [...prev.landmarks, landmark.trim()]
      }));
    }
  };

  const removeLandmark = (index: number) => {
    setFormData(prev => ({
      ...prev,
      landmarks: prev.landmarks.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    // In a real app, this would open camera/gallery
    const newImage = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.city) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Property Listed Successfully!',
        'Your property has been posted and is now visible to potential tenants.',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.replace('/dashboard')
          },
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                price: '',
                city: '',
                neighborhood: '',
                streetName: '',
                houseName: '',
                rooms: '',
                toilets: '',
                squareMeters: '',
                contactPhone: '',
                images: [],
                amenities: [],
                landmarks: [],
              });
            }
          }
        ]
      );
    }, 2000);
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
        <Text style={styles.headerTitle}>
          Post Property
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Images Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos *</Text>
              <Text style={styles.sectionSubtitle}>Add up to 10 photos of your property</Text>
              
              <View style={styles.imagesContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {formData.images.length < 10 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                    <Camera size={24} color="#6B7280" />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputContainer}>
                <Building2 size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Modern Studio Near UY1, 2-Bedroom Apartment in Bastos *"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.textAreaContainer}>
                <FileText size={20} color="#6B7280" style={styles.textAreaIcon} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your property, its features, and any important details... *"
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Monthly rent (FCFA) *"
                  value={formData.price}
                  onChangeText={(text) => updateFormData('price', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="City *"
                  value={formData.city}
                  onChangeText={(text) => updateFormData('city', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Neighborhood"
                  value={formData.neighborhood}
                  onChangeText={(text) => updateFormData('neighborhood', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Street Name"
                  value={formData.streetName}
                  onChangeText={(text) => updateFormData('streetName', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Building2 size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="House/Building Name"
                  value={formData.houseName}
                  onChangeText={(text) => updateFormData('houseName', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Property Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Details (Optional)</Text>
              
              <View style={styles.detailsRow}>
                <View style={styles.detailInput}>
                  <Home size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Number of Rooms"
                    value={formData.rooms}
                    onChangeText={(text) => updateFormData('rooms', text)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.detailInput}>
                  <Bath size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Number of Toilets"
                    value={formData.toilets}
                    onChangeText={(text) => updateFormData('toilets', text)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Maximize size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Size (square meters)"
                  value={formData.squareMeters}
                  onChangeText={(text) => updateFormData('squareMeters', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {availableAmenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.id);
                  
                  return (
                    <TouchableOpacity
                      key={amenity.id}
                      style={[
                        styles.amenityCard,
                        isSelected && styles.amenityCardSelected
                      ]}
                      onPress={() => toggleAmenity(amenity.id)}
                    >
                      <IconComponent 
                        size={20} 
                        color={isSelected ? "#FFFFFF" : "#6B7280"} 
                      />
                      <Text style={[
                        styles.amenityText,
                        isSelected && styles.amenityTextSelected
                      ]}>
                        {amenity.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Landmarks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nearby Landmarks (Optional)</Text>
              <Text style={styles.sectionSubtitle}>Add nearby schools, hospitals, markets, or transport stations</Text>
              
              <LandmarkInput onAddLandmark={addLandmark} />
              
              {formData.landmarks.length > 0 && (
                <View style={styles.landmarksContainer}>
                  {formData.landmarks.map((landmark, index) => (
                    <View key={index} style={styles.landmarkChip}>
                      <Navigation size={14} color="#3B82F6" />
                      <Text style={styles.landmarkText}>{landmark}</Text>
                      <TouchableOpacity
                        onPress={() => removeLandmark(index)}
                        style={styles.removeLandmarkButton}
                      >
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Contact phone number"
                  value={formData.contactPhone}
                  onChangeText={(text) => updateFormData('contactPhone', text)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!formData.title || !formData.description || !formData.price || !formData.city) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.price || !formData.city}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Posting...' : 'Post Property'}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageItem: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  textAreaContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  amenityCardSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  amenityText: {
    fontSize: 14,
    color: '#6B7280',
  },
  amenityTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  landmarkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  landmarkInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    marginRight: 8,
  },
  addLandmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landmarksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  landmarkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 6,
  },
  landmarkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  removeLandmarkButton: {
    padding: 2,
  },
});