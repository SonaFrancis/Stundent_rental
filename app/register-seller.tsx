import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  Store,
  User, 
  MapPin, 
  Phone, 
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';

export default function RegisterSellerScreen() {
  const router = useRouter();
  const { user, updateUser } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessBio: '',
    contactNumber: user?.phone || '',
    idNumber: '',
    bankAccount: '',
    sellingExperience: '',
    preferredCategories: [] as string[],
    reasonForSelling: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    'Individual/Personal Seller',
    'Small Business',
    'Online Store',
    'Wholesale Business'
  ];

  const categories = [
    'Electronics',
    'Furniture',
    'Vehicles',
    'Real Estate/Land',
    'Business Equipment',
    'Fashion & Accessories'
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business/Shop name is required';
      }
      if (!formData.businessType) {
        newErrors.businessType = 'Please select your business type';
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
    }
    
    if (step === 2) {
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      }
      if (!formData.idNumber.trim()) {
        newErrors.idNumber = 'ID/Passport number is required';
      }
    }
    
    if (step === 3) {
      if (!formData.reasonForSelling.trim()) {
        newErrors.reasonForSelling = 'Please tell us why you want to sell';
      }
      if (formData.preferredCategories.length === 0) {
        newErrors.preferredCategories = 'Please select at least one category';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call for seller registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user with seller status
      if (user && updateUser) {
        updateUser({
          ...user,
          isRegisteredSeller: true,
          sellerApplicationStatus: 'approved', // In real app, this might be 'pending' initially
        });
      }
      
      Alert.alert(
        'Registration Successful!', 
        'Welcome to our seller community! You can now start listing your items for sale.',
        [
          {
            text: 'Start Selling',
            onPress: () => {
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to register as seller. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCategory = (category: string) => {
    const currentCategories = formData.preferredCategories;
    if (currentCategories.includes(category)) {
      updateFormData('preferredCategories', currentCategories.filter(c => c !== category));
    } else {
      updateFormData('preferredCategories', [...currentCategories, category]);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Store size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Business Information</Text>
        <Text style={styles.stepDescription}>
          Tell us about your business or selling activity
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <User size={20} color="#6B7280" />
        <TextInput
          style={[styles.input, errors.businessName && styles.inputError]}
          placeholder="Business/Shop Name *"
          value={formData.businessName}
          onChangeText={(text) => updateFormData('businessName', text)}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}

      <View style={styles.sectionTitle}>
        <Text style={styles.label}>Business Type *</Text>
      </View>
      {businessTypes.map((type, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            formData.businessType === type && styles.selectedOption
          ]}
          onPress={() => updateFormData('businessType', type)}
        >
          <Text style={[
            styles.optionText,
            formData.businessType === type && styles.selectedOptionText
          ]}>
            {type}
          </Text>
          {formData.businessType === type && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>
      ))}
      {errors.businessType && <Text style={styles.errorText}>{errors.businessType}</Text>}

      <View style={styles.inputContainer}>
        <MapPin size={20} color="#6B7280" />
        <TextInput
          style={[styles.input, errors.businessAddress && styles.inputError]}
          placeholder="Business Address *"
          value={formData.businessAddress}
          onChangeText={(text) => updateFormData('businessAddress', text)}
          placeholderTextColor="#9CA3AF"
          multiline
        />
      </View>
      {errors.businessAddress && <Text style={styles.errorText}>{errors.businessAddress}</Text>}

      <View style={styles.sectionTitle}>
        <Text style={styles.label}>Business Bio</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about your business and what you sell..."
          value={formData.businessBio}
          onChangeText={(text) => {
            if (text.length <= 101) {
              updateFormData('businessBio', text);
            }
          }}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
          maxLength={101}
        />
      </View>
      <Text style={styles.characterCount}>
        {formData.businessBio.length}/101 characters
      </Text>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <CreditCard size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Verification Details</Text>
        <Text style={styles.stepDescription}>
          We need these details to verify your identity and for secure transactions
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Phone size={20} color="#6B7280" />
        <TextInput
          style={[styles.input, errors.contactNumber && styles.inputError]}
          placeholder="Contact Number *"
          value={formData.contactNumber}
          onChangeText={(text) => updateFormData('contactNumber', text)}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

      <View style={styles.inputContainer}>
        <CreditCard size={20} color="#6B7280" />
        <TextInput
          style={[styles.input, errors.idNumber && styles.inputError]}
          placeholder="National ID or Passport Number *"
          value={formData.idNumber}
          onChangeText={(text) => updateFormData('idNumber', text)}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}

      <View style={styles.inputContainer}>
        <CreditCard size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Bank Account (Optional - for payments)"
          value={formData.bankAccount}
          onChangeText={(text) => updateFormData('bankAccount', text)}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Clock size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Years of selling experience (Optional)"
          value={formData.sellingExperience}
          onChangeText={(text) => updateFormData('sellingExperience', text)}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <CheckCircle size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Selling Preferences</Text>
        <Text style={styles.stepDescription}>
          Help us understand what you plan to sell
        </Text>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.label}>What categories will you sell? *</Text>
      </View>
      <View style={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              formData.preferredCategories.includes(category) && styles.selectedCategory
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              formData.preferredCategories.includes(category) && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.preferredCategories && <Text style={styles.errorText}>{errors.preferredCategories}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.textArea, errors.reasonForSelling && styles.inputError]}
          placeholder="Why do you want to sell on our platform? *"
          value={formData.reasonForSelling}
          onChangeText={(text) => updateFormData('reasonForSelling', text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.reasonForSelling && <Text style={styles.errorText}>{errors.reasonForSelling}</Text>}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
      >
        <View style={[styles.checkbox, formData.agreeToTerms && styles.checkedBox]}>
          {formData.agreeToTerms && <CheckCircle size={16} color="#FFFFFF" />}
        </View>
        <Text style={styles.checkboxText}>
          I agree to the Terms of Service and Privacy Policy for sellers *
        </Text>
      </TouchableOpacity>
      {errors.agreeToTerms && <Text style={styles.errorText}>{errors.agreeToTerms}</Text>}
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 3</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register as Seller</Text>
        <View style={styles.placeholder} />
      </View>

      {renderProgressBar()}

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backStepButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backStepButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.nextButtonText}>
              {isLoading ? 'Processing...' : currentStep === 3 ? 'Complete Registration' : 'Next'}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 16,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedCategory: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    color: '#1F2937',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  backStepButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 12,
    marginRight: 4,
  },
});