import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { 
  Settings, 
  Chrome as Home, 
  MessageSquare, 
  Shield, 
  LogOut, 
  CreditCard as Edit, 
  Phone, 
  Mail, 
  Building2, 
  DollarSign, 
  BarChart3,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SellCategoryModal } from '@/components/SellCategoryModal';

export default function ProfileScreen() {
  const { user, signOut, properties } = useApp();
  const router = useRouter();
  const [showSellModal, setShowSellModal] = useState(false);

  const userProperties = properties.filter(p => p.landlordId === user?.id);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          signOut();
          router.replace('/');
        }},
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {user.verified && (
                  <Shield size={16} color="#10B981" style={styles.verifiedIcon} />
                )}
              </View>
              <Text style={styles.userType}>
                {user.userType === 'student' ? 'Student' : 'Property Owner'}
              </Text>
              {user.bio && (
                <Text style={styles.bio}>{user.bio}</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Mail size={16} color="#6B7280" />
            <Text style={styles.contactText}>{user.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.contactText}>{user.phone}</Text>
          </View>
        </View>


        {user.userType === 'landlord' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Home size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>My Properties</Text>
              <Text style={styles.sectionCount}>{userProperties.length}</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.propertyList}>
                {userProperties.map(property => (
                  <TouchableOpacity
                    key={property.id}
                    style={styles.propertyCard}
                    onPress={() => router.push(`/property/${property.id}`)}
                  >
                    <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
                    <Text style={styles.propertyTitle} numberOfLines={2}>
                      {property.title}
                    </Text>
                    <Text style={styles.propertyPrice}>
                      {property.price.toLocaleString()} FCFA
                    </Text>
                    <View style={[
                      styles.statusIndicator,
                      property.available ? styles.available : styles.unavailable
                    ]}>
                      <Text style={styles.statusText}>
                        {property.available ? 'Available' : 'Rented'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/edit-profile')}
          >
            <View style={styles.menuIcon}>
              <Edit size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          {user.userType === 'student' && (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push('/become-landlord')}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#3B82F6' }]}>
                <Building2 size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.menuText}>Become a Landlord</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          {user.isRegisteredSeller ? (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowSellModal(true)}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#10B981' }]}>
                <DollarSign size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.menuText}>Sell Your Items</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push('/register-seller')}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#10B981' }]}>
                <DollarSign size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.menuText}>Register as a Seller</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          {user.isRegisteredSeller && (
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard')}>
              <View style={[styles.menuIcon, { backgroundColor: '#10B981' }]}>
                <BarChart3 size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.menuText}>My Dashboard</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#6B7280' }]}>
              <Settings size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help-support')}>
            <View style={[styles.menuIcon, { backgroundColor: '#6B7280' }]}>
              <MessageSquare size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <SellCategoryModal
        visible={showSellModal}
        onClose={() => setShowSellModal(false)}
        onSelectCategory={(category) => {
          router.push(`/sell-item?category=${category}`);
        }}
      />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  profileInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 6,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  userType: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyList: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  propertyCard: {
    width: 150,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  propertyImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  propertyPrice: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 6,
  },
  statusIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  available: {
    backgroundColor: '#DCFCE7',
  },
  unavailable: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#065F46',
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});