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
  Plus,
  X
} from 'lucide-react-native';

export default function SellItemScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    condition: 'good',
    contactPhone: '',
    images: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryTitles = {
    land: 'Landed Property',
    house: 'House/Apartment',
    furniture: 'Furniture & Home Items',
    electronics: 'Electronics',
    vehicles: 'Vehicle',
    business: 'Business Item',
  };

  const conditionOptions = [
    { value: 'new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Needs Repair' },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Item Listed Successfully!',
        'Your item has been posted and is now visible to other users. You now have access to your seller dashboard where you can manage your listings.',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/dashboard')
          },
          {
            text: 'Back to Profile',
            onPress: () => router.back()
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
          Sell {categoryTitles[category as keyof typeof categoryTitles] || 'Item'}
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
              <Text style={styles.sectionSubtitle}>Add up to 5 photos of your item</Text>
              
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
                
                {formData.images.length < 5 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                    <Camera size={24} color="#6B7280" />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Title *</Text>
              <View style={styles.inputContainer}>
                <Tag size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description *</Text>
              <View style={styles.textAreaContainer}>
                <FileText size={20} color="#6B7280" style={styles.textAreaIcon} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your item, its condition, and any important details..."
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Price */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price (FCFA) *</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your asking price"
                  value={formData.price}
                  onChangeText={(text) => updateFormData('price', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Condition */}
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

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location *</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="City, neighborhood"
                  value={formData.location}
                  onChangeText={(text) => updateFormData('location', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Contact Phone */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Phone</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Your phone number"
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
              (!formData.title || !formData.description || !formData.price || !formData.location) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.price || !formData.location}
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
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  conditionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionTextActive: {
    color: '#3B82F6',
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