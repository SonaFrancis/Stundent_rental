import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'student' as 'student' | 'landlord',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();

  const handleSignup = async () => {
    const { fullName, email, phone, password, confirmPassword, userType } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, {
        full_name: fullName,
        phone,
        user_type: userType,
      });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our housing community</Text>

          <View style={styles.form}>
            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>I am a:</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'student' && styles.userTypeButtonActive,
                  ]}
                  onPress={() => updateFormData('userType', 'student')}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === 'student' && styles.userTypeButtonTextActive,
                    ]}
                  >
                    Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'landlord' && styles.userTypeButtonActive,
                  ]}
                  onPress={() => updateFormData('userType', 'landlord')}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === 'landlord' && styles.userTypeButtonTextActive,
                    ]}
                  >
                    Landlord
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => updateFormData('fullName', text)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  userTypeButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  userTypeButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  userTypeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeIcon: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginTextBold: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});