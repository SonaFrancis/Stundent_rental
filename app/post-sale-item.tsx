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
  Tag,
  Phone,
  X,
  Package,
  Building2,
  Smartphone,
  Car,
  Briefcase
} from 'lucide-react-native';

export default function PostSaleItemScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: category || 'electronics',
    condition: 'good',
    location: '',
    contactPhone: '',
    images: [] as string[],
    specifications: {} as Record<string, string>,
    businessLocation: '',
    monthlyRevenue: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'land', name: 'Land', icon: MapPin, color: '#16A34A' },
    { id: 'house', name: 'Houses', icon: Building2, color: '#3B82F6' },
    { id: 'furniture', name: 'Furniture', icon: Package, color: '#A855F7' },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, color: '#F59E0B' },
    { id: 'vehicles', name: 'Vehicles', icon: Car, color: '#EF4444' },
    { id: 'business', name: 'Business', icon: Briefcase, color: '#10B981' },
  ];

  const conditionOptions = [
    { value: 'new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Needs Repair' },
  ];

  const getCategorySpecifications = (cat: string) => {
    switch (cat) {
      case 'electronics':
        return ['Brand', 'Model', 'Year', 'Warranty Status'];
      case 'vehicles':
        return ['Make', 'Model', 'Year', 'Mileage', 'Fuel Type', 'Transmission'];
      case 'furniture':
        return ['Material', 'Dimensions', 'Color', 'Style'];
      case 'house':
        return ['Bedrooms', 'Bathrooms', 'Square Meters', 'Property Type'];
      case 'land':
        return ['Size (Hectares)', 'Land Use', 'Title Type', 'Access Road'];
      case 'business':
        return ['Business Type', 'Established Year', 'Annual Revenue', 'Staff Count'];
      default:
        return ['Brand', 'Model', 'Size'];
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // If category is changed to land or business, remove condition requirement
      if (field === 'category' && (value === 'land' || value === 'business')) {
        updated.condition = '';
      }
      // If category is changed from land/business to something else, set default condition
      else if (field === 'category' && (prev.category === 'land' || prev.category === 'business') && value !== 'land' && value !== 'business') {
        updated.condition = 'good';
      }
      
      return updated;
    });
  };

  const updateSpecification = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value }
    }));
  };

  const addImage = () => {
    if (formData.images.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload maximum 10 images.');
      return;
    }
    
    // In a real app, this would open camera/gallery with proper constraints
    // Images should be optimized to: max 1200x1200, compressed quality, under 2MB
    const newImage = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`;
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
    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image of your item.');
      return;
    }

    if (formData.category !== 'land' && formData.category !== 'business' && !formData.condition) {
      Alert.alert('Missing Information', 'Please select the condition of your item.');
      return;
    }

    if (formData.category === 'business' && (!formData.businessLocation || !formData.monthlyRevenue)) {
      Alert.alert('Missing Information', 'Please fill in business location and monthly revenue.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Item Listed Successfully!',
        'Your item has been posted and is now visible in the marketplace.',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.replace('/dashboard?tab=sales')
          },
          {
            text: 'Add Another Item',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                price: '',
                category: category || 'electronics',
                condition: 'good',
                location: '',
                contactPhone: '',
                images: [],
                specifications: {},
                businessLocation: '',
                monthlyRevenue: '',
              });
            }
          }
        ]
      );
    }, 2000);
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

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
          Sell {selectedCategory?.name || 'Item'}
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesRow}>
                  {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = formData.category === cat.id;
                    
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryChip,
                          isSelected && { 
                            backgroundColor: cat.color,
                            borderColor: cat.color 
                          }
                        ]}
                        onPress={() => updateFormData('category', cat.id)}
                      >
                        <IconComponent 
                          size={16} 
                          color={isSelected ? "#FFFFFF" : cat.color} 
                        />
                        <Text style={[
                          styles.categoryChipText,
                          isSelected && { color: '#FFFFFF' }
                        ]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Images Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos * ({formData.images.length}/10)</Text>
              <Text style={styles.sectionSubtitle}>Add clear photos to attract more buyers</Text>
              
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

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Item Details</Text>
              
              <View style={styles.inputContainer}>
                <Tag size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="What are you selling? *"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.textAreaContainer}>
                <FileText size={20} color="#6B7280" style={styles.textAreaIcon} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your item, its condition, features, and reason for selling... *"
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  multiline
                  numberOfLines={5}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Asking price (FCFA) *"
                  value={formData.price}
                  onChangeText={(text) => updateFormData('price', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Condition - Don't show for land and business categories */}
            {formData.category !== 'land' && formData.category !== 'business' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Condition</Text>
                <View style={styles.conditionContainer}>
                  {conditionOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.conditionOption,
                        formData.condition === option.value && styles.conditionOptionActive
                      ]}
                      onPress={() => updateFormData('condition', option.value)}
                    >
                      <Text style={[
                        styles.conditionText,
                        formData.condition === option.value && styles.conditionTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Category-specific specifications - Don't show for furniture category */}
            {formData.category !== 'furniture' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                {getCategorySpecifications(formData.category).map((spec) => (
                  <View key={spec} style={styles.inputContainer}>
                    <Tag size={20} color="#6B7280" />
                    <TextInput
                      style={styles.input}
                      placeholder={spec}
                      value={formData.specifications[spec] || ''}
                      onChangeText={(text) => updateSpecification(spec, text)}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Business-specific fields */}
            {formData.category === 'business' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Details</Text>
                
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Business Location *"
                    value={formData.businessLocation}
                    onChangeText={(text) => updateFormData('businessLocation', text)}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <DollarSign size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Monthly Revenue (FCFA) *"
                    value={formData.monthlyRevenue}
                    onChangeText={(text) => updateFormData('monthlyRevenue', text)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location & Contact</Text>
              
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="City, neighborhood *"
                  value={formData.location}
                  onChangeText={(text) => updateFormData('location', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

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
              (!formData.title || !formData.description || !formData.price || !formData.location || formData.images.length === 0 || (formData.category !== 'land' && formData.category !== 'business' && !formData.condition) || (formData.category === 'business' && (!formData.businessLocation || !formData.monthlyRevenue))) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.price || !formData.location || formData.images.length === 0 || (formData.category !== 'land' && formData.category !== 'business' && !formData.condition) || (formData.category === 'business' && (!formData.businessLocation || !formData.monthlyRevenue))}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Posting...' : 'Post Item'}
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
  categoriesRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
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
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
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
    width: 120,
    height: 120,
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
    minHeight: 100,
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  conditionOptionActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  conditionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionTextActive: {
    color: '#10B981',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#10B981',
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
});