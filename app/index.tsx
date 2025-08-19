import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Chrome as Home, Mail, Lock, User } from 'lucide-react-native';

export default function OnboardingScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('jean.kamga@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'student' | 'landlord'>('student');
  
  const { signIn, isAuthenticated } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated && router.isReady) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, router.isReady]);

  const handleAuth = async () => {
    if (isLogin) {
      const success = await signIn(email, password);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', 'Invalid credentials. Try: jean.kamga@gmail.com');
      }
    } else {
      // Mock signup - in real app, this would create a new user
      Alert.alert('Success', 'Account created! Please sign in.');
      setIsLogin(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Home size={40} color="#3B82F6" />
          </View>
          <Text style={styles.title}>CameroonStudentHomes</Text>
          <Text style={styles.subtitle}>
            Find your perfect student accommodation in Cameroon
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[styles.userTypeButton, userType === 'student' && styles.userTypeActive]}
                  onPress={() => setUserType('student')}
                >
                  <Text style={[styles.userTypeText, userType === 'student' && styles.userTypeTextActive]}>
                    Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.userTypeButton, userType === 'landlord' && styles.userTypeActive]}
                  onPress={() => setUserType('landlord')}
                >
                  <Text style={[styles.userTypeText, userType === 'landlord' && styles.userTypeTextActive]}>
                    Landlord
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Mail size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <View style={styles.demoInfo}>
              <Text style={styles.demoText}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Email: jean.kamga@gmail.com</Text>
              <Text style={styles.demoText}>Password: password123</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#3B82F6',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  userTypeActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  userTypeTextActive: {
    color: '#3B82F6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  authButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  demoInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 2,
  },
});