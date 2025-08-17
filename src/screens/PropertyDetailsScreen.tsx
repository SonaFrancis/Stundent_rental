import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';

const { width } = Dimensions.get('window');

interface PropertyDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      property: Property;
    };
  };
}

export const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { property } = route.params;
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString()} FCFA/month`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  const handleContactLandlord = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to contact the landlord');
      return;
    }

    if (user.id === property.landlord_id) {
      Alert.alert('Info', 'This is your own property');
      return;
    }

    try {
      const chat = await chatService.getOrCreateChat(
        property.id,
        user.id,
        property.landlord_id
      );
      
      navigation.navigate('Chat', { 
        chatId: chat.id,
        property,
        otherUser: property.landlord,
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Failed to start conversation');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image || 'https://via.placeholder.com/400x300' }}
                style={styles.propertyImage}
              />
            ))}
          </ScrollView>
          <View style={styles.imageIndicator}>
            <Text style={styles.imageIndicatorText}>
              {currentImageIndex + 1} / {property.images.length}
            </Text>
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>
                {property.type === 'rent' ? 'For Rent' : 'For Sale'}
              </Text>
            </View>
          </View>

          <Text style={styles.price}>
            {formatPrice(property.price, property.type)}
          </Text>

          <View style={styles.locationSection}>
            <Ionicons name="location" size={20} color="#4F46E5" />
            <Text style={styles.location}>
              {property.street_name}, {property.neighborhood}, {property.city}
            </Text>
          </View>

          {property.house_name && (
            <Text style={styles.houseName}>{property.house_name}</Text>
          )}

          {/* Property Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Ionicons name="bed" size={20} color="#666" />
              <Text style={styles.detailText}>{property.bedrooms} Bedrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={20} color="#666" />
              <Text style={styles.detailText}>{property.bathrooms} Bathrooms</Text>
            </View>
            {property.area_sqm && (
              <View style={styles.detailItem}>
                <Ionicons name="resize" size={20} color="#666" />
                <Text style={styles.detailText}>{property.area_sqm} m²</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Nearby Landmarks */}
          {property.nearby_landmarks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nearby Landmarks</Text>
              {property.nearby_landmarks.map((landmark, index) => (
                <View key={index} style={styles.landmarkItem}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.landmarkText}>{landmark}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Landlord Info */}
          {property.landlord && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.landlordInfo}>
                <View style={styles.landlordAvatar}>
                  <Ionicons name="person" size={24} color="#4F46E5" />
                </View>
                <View style={styles.landlordDetails}>
                  <Text style={styles.landlordName}>{property.landlord.full_name}</Text>
                  <Text style={styles.landlordType}>Landlord</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactLandlord}
        >
          <Ionicons name="chatbubble" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contact Landlord</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  typeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 16,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  houseName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  detailsSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    color: '#374151',
  },
  landmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  landmarkText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  landlordDetails: {
    flex: 1,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  landlordType: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});