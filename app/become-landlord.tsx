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
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  FileText,
  Camera,
  CheckCircle
} from 'lucide-react-native';

export default function BecomeLandlordScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    landlordType: '',
    companyName: '',
    agentName: '',
    companyBio: '',
    individualBio: '',
    idNumber: '',
    address: '',
    propertyExperience: '',
    motivation: '',
    hasProperties: false,
    propertyCount: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.phoneNumber && formData.email && formData.landlordType &&
               (formData.landlordType === 'individual' ? true : formData.companyName);
      case 2:
        return formData.idNumber && formData.address;
      case 3:
        return formData.motivation && formData.propertyExperience;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      Alert.alert('Incomplete', 'Please fill in all required fields.');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Application Submitted!',
        'Thank you for your application. You now have access to your seller dashboard where you can manage your listings. We will review your landlord application and get back to you within 2-3 business days.',
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

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 3</Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Building2 size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Personal Information</Text>
        <Text style={styles.stepDescription}>Let's start with your basic details</Text>
      </View>

      <View style={styles.inputContainer}>
        <User size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={formData.fullName}
          onChangeText={(text) => updateFormData('fullName', text)}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Phone size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={formData.phoneNumber}
          onChangeText={(text) => updateFormData('phoneNumber', text)}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <Text style={styles.sectionLabel}>Are you registering as? *</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            formData.landlordType === 'individual' && styles.selectedOption
          ]}
          onPress={() => updateFormData('landlordType', 'individual')}
        >
          <Text style={[
            styles.optionText,
            formData.landlordType === 'individual' && styles.selectedOptionText
          ]}>
            Individual Property Owner
          </Text>
          {formData.landlordType === 'individual' && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            formData.landlordType === 'company' && styles.selectedOption
          ]}
          onPress={() => updateFormData('landlordType', 'company')}
        >
          <Text style={[
            styles.optionText,
            formData.landlordType === 'company' && styles.selectedOptionText
          ]}>
            Real Estate Company/Agency
          </Text>
          {formData.landlordType === 'company' && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>
      </View>

      {formData.landlordType === 'individual' && (
        <View style={styles.textAreaContainer}>
          <Text style={styles.textAreaLabel}>Personal Bio</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about yourself and your property background..."
            value={formData.individualBio}
            onChangeText={(text) => {
              if (text.length <= 101) {
                updateFormData('individualBio', text);
              }
            }}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
            maxLength={101}
          />
          <Text style={styles.characterCount}>
            {formData.individualBio.length}/101 characters
          </Text>
        </View>
      )}

      {formData.landlordType === 'company' && (
        <>
          <View style={styles.inputContainer}>
            <Building2 size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Company/Agency Name *"
              value={formData.companyName}
              onChangeText={(text) => updateFormData('companyName', text)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <User size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Agent Name (Optional)"
              value={formData.agentName}
              onChangeText={(text) => updateFormData('agentName', text)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textAreaLabel}>Company Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us about your company and services..."
              value={formData.companyBio}
              onChangeText={(text) => {
                if (text.length <= 101) {
                  updateFormData('companyBio', text);
                }
              }}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              maxLength={101}
            />
            <Text style={styles.characterCount}>
              {formData.companyBio.length}/101 characters
            </Text>
          </View>
        </>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <FileText size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Identification & Address</Text>
        <Text style={styles.stepDescription}>We need to verify your identity</Text>
      </View>

      <View style={styles.inputContainer}>
        <FileText size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="ID Card / Passport Number *"
          value={formData.idNumber}
          onChangeText={(text) => updateFormData('idNumber', text)}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputContainer}>
        <MapPin size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Current Address *"
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
          multiline
          numberOfLines={3}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <TouchableOpacity style={styles.uploadButton}>
        <Camera size={20} color="#3B82F6" />
        <Text style={styles.uploadButtonText}>Upload ID Document</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <CheckCircle size={32} color="#10B981" />
        <Text style={styles.stepTitle}>Property Experience</Text>
        <Text style={styles.stepDescription}>Tell us about your property goals</Text>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => updateFormData('hasProperties', !formData.hasProperties)}
      >
        <View style={[styles.checkbox, formData.hasProperties && styles.checkedBox]}>
          {formData.hasProperties && <CheckCircle size={16} color="#FFFFFF" />}
        </View>
        <Text style={styles.checkboxText}>I already own properties</Text>
      </TouchableOpacity>

      {formData.hasProperties && (
        <View style={styles.inputContainer}>
          <Building2 size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="How many properties do you own?"
            value={formData.propertyCount}
            onChangeText={(text) => updateFormData('propertyCount', text)}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}

      <View style={styles.textAreaContainer}>
        <Text style={styles.textAreaLabel}>Property Management Experience *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your experience with property management or real estate..."
          value={formData.propertyExperience}
          onChangeText={(text) => {
            if (text.length <= 101) {
              updateFormData('propertyExperience', text);
            }
          }}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
          maxLength={101}
        />
        <Text style={styles.characterCount}>
          {formData.propertyExperience.length}/101 characters
        </Text>
      </View>

      <View style={styles.textAreaContainer}>
        <Text style={styles.textAreaLabel}>Why do you want to become a landlord? *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us your motivation for joining as a property owner..."
          value={formData.motivation}
          onChangeText={(text) => {
            if (text.length <= 101) {
              updateFormData('motivation', text);
            }
          }}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
          maxLength={101}
        />
        <Text style={styles.characterCount}>
          {formData.motivation.length}/101 characters
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Become a Landlord</Text>
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
            style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? 'Processing...' : currentStep === 3 ? 'Complete Registration' : 'Next'}
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
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#3B82F6',
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
  textAreaContainer: {
    marginBottom: 24,
  },
  textAreaLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 100,
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 20,
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
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
});