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
        return formData.fullName && formData.phoneNumber && formData.email;
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
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.progressStep}>
          <View style={[
            styles.progressCircle,
            step <= currentStep ? styles.activeProgressCircle : styles.inactiveProgressCircle
          ]}>
            {step < currentStep ? (
              <CheckCircle size={16} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.progressNumber,
                step === currentStep ? styles.activeProgressNumber : styles.inactiveProgressNumber
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View style={[
              styles.progressLine,
              step < currentStep ? styles.activeProgressLine : styles.inactiveProgressLine
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Let's start with your basic details</Text>

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
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Identification & Address</Text>
      <Text style={styles.stepSubtitle}>We need to verify your identity</Text>

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
      <Text style={styles.stepTitle}>Property Experience</Text>
      <Text style={styles.stepSubtitle}>Tell us about your property goals</Text>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.hasProperties && styles.checkboxActive]}
          onPress={() => updateFormData('hasProperties', !formData.hasProperties)}
        >
          {formData.hasProperties && <CheckCircle size={16} color="#FFFFFF" />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I already own properties</Text>
      </View>

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
          onChangeText={(text) => updateFormData('propertyExperience', text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.textAreaContainer}>
        <Text style={styles.textAreaLabel}>Why do you want to become a landlord? *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us your motivation for joining as a property owner..."
          value={formData.motivation}
          onChangeText={(text) => updateFormData('motivation', text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
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
            style={[
              styles.nextButton,
              !validateStep(currentStep) && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={isSubmitting || !validateStep(currentStep)}
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? 'Submitting...' : currentStep === 3 ? 'Submit Application' : 'Next'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeProgressCircle: {
    backgroundColor: '#3B82F6',
  },
  inactiveProgressCircle: {
    backgroundColor: '#E5E7EB',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeProgressNumber: {
    color: '#FFFFFF',
  },
  inactiveProgressNumber: {
    color: '#9CA3AF',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  activeProgressLine: {
    backgroundColor: '#3B82F6',
  },
  inactiveProgressLine: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
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
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1F2937',
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
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  backStepButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
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
});