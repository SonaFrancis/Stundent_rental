import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { Property } from '../types';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProperties();
  }, [user]);

  const loadUserProperties = async () => {
    if (!user) return;
    
    try {
      const properties = await propertyService.getPropertiesByLandlord(user.id);
      setUserProperties(properties);
    } catch (error) {
      console.error('Error loading user properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => {
        // TODO: Navigate to edit profile screen
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon');
      },
    },
    {
      icon: 'heart-outline',
      title: 'Saved Properties',
      onPress: () => {
        // TODO: Navigate to saved properties screen
        Alert.alert('Coming Soon', 'Saved properties feature will be available soon');
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => {
        // TODO: Navigate to notifications settings
        Alert.alert('Coming Soon', 'Notification settings will be available soon');
      },
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => {
        // TODO: Navigate to help screen
        Alert.alert('Coming Soon', 'Help & support will be available soon');
      },
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => {
        Alert.alert(
          'About',
          'Student Housing Cameroon v1.0.0\n\nFind your perfect student accommodation across Cameroon.'
        );
      },
    },
  ];

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#4F46E5" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userTypeTag}>
          <Text style={styles.userTypeText}>
            {user.user_type === 'student' ? 'Student' : 'Landlord'}
          </Text>
        </View>
      </View>

      {/* User Properties (for landlords) */}
      {user.user_type === 'landlord' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Properties</Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to add property screen
                Alert.alert('Coming Soon', 'Add property feature will be available soon');
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading properties...</Text>
          ) : userProperties.length > 0 ? (
            <View style={styles.propertiesGrid}>
              {userProperties.slice(0, 4).map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.propertyCard}
                  onPress={() => navigation.navigate('PropertyDetails', { property })}
                >
                  <Image
                    source={{
                      uri: property.images[0] || 'https://via.placeholder.com/150x100',
                    }}
                    style={styles.propertyImage}
                  />
                  <Text style={styles.propertyTitle} numberOfLines={2}>
                    {property.title}
                  </Text>
                  <Text style={styles.propertyPrice}>
                    {property.price.toLocaleString()} FCFA
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No properties yet</Text>
          )}
          
          {userProperties.length > 4 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Properties</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.section}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Ionicons name={item.icon as any} size={24} color="#666" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  userTypeTag: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  propertyImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  viewAllButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 16,
    fontWeight: '500',
  },
});