import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => Alert.alert('Coming Soon', 'Edit profile feature will be available soon'),
    },
    {
      icon: 'heart-outline',
      title: 'Saved Properties',
      onPress: () => Alert.alert('Coming Soon', 'Saved properties feature will be available soon'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => Alert.alert(
        'About',
        'Student Housing Cameroon v1.0.0\n\nFind your perfect student accommodation across Cameroon.'
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#4F46E5" />
            </View>
          </View>
          <Text style={styles.userName}>Student User</Text>
          <Text style={styles.userEmail}>student@example.com</Text>
          <View style={styles.userTypeTag}>
            <Text style={styles.userTypeText}>Student</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={() => Alert.alert('Sign Out', 'Sign out functionality will be available with authentication')}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    paddingVertical: 8,
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

export default ProfileScreen;

export { ProfileScreen }