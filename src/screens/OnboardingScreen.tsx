import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="home" size={80} color="#fff" />
        </View>
        
        <Text style={styles.title}>Find Your Perfect Home</Text>
        <Text style={styles.subtitle}>
          Discover student-friendly housing across Cameroon. From rentals to purchases, 
          we've got you covered.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="search" size={24} color="#fff" />
            <Text style={styles.featureText}>Easy Search</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
            <Text style={styles.featureText}>Direct Chat</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
            <Text style={styles.featureText}>Verified Listings</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  getStartedButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});