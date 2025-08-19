import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { mockUsers, mockReviews } from '@/data/mockData';
import { AmenityIcon } from '@/components/AmenityIcon';
import { ReviewCard } from '@/components/ReviewCard';
import { formatCurrency, formatDistance } from '@/utils/currency';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MessageCircle, 
  MapPin,
  Ruler,
  Calendar,
  Star
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, user, startChat } = useApp();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const property = properties.find(p => p.id === id);
  const landlord = mockUsers.find(u => u.id === property?.landlordId);
  const propertyReviews = mockReviews.filter(r => r.propertyId === id);
  
  const averageRating = propertyReviews.length > 0 
    ? propertyReviews.reduce((sum, review) => sum + review.rating, 0) / propertyReviews.length
    : 0;

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
      </View>
    );
  }

  const handleContactLandlord = () => {
    if (!user || !landlord) return;
    
    if (user.userType === 'landlord') {
      Alert.alert('Info', 'You cannot message other landlords.');
      return;
    }

    const chatId = startChat(property.id, landlord.id);
    router.push(`/chat/${chatId}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed' : 'Saved',
      isSaved ? 'Property removed from saved list' : 'Property saved to your list'
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
            <Heart size={24} color={isSaved ? "#EF4444" : "#1F2937"} fill={isSaved ? "#EF4444" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicators}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{property.title}</Text>
              <View style={[
                styles.typeBadge,
                property.type === 'rent' ? styles.rentBadge : styles.saleBadge
              ]}>
                <Text style={styles.typeText}>
                  {property.type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                </Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.location}>
                {property.streetName}, {property.neighborhood}, {property.city}
              </Text>
            </View>
            
            <Text style={styles.price}>
              {formatCurrency(property.price)}
              {property.type === 'rent' && (
                <Text style={styles.period}> /month</Text>
              )}
            </Text>
          </View>

          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoNumber}>{property.bedrooms}</Text>
              <Text style={styles.quickInfoLabel}>Bedrooms</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoNumber}>{property.bathrooms}</Text>
              <Text style={styles.quickInfoLabel}>Bathrooms</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoNumber}>{property.squareMeters}</Text>
              <Text style={styles.quickInfoLabel}>m²</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map(amenity => (
                <AmenityIcon
                  key={amenity.id}
                  name={amenity.name}
                  icon={amenity.icon}
                  available={amenity.available}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Landmarks</Text>
            {property.nearbyLandmarks.map(landmark => (
              <View key={landmark.id} style={styles.landmarkItem}>
                <View style={styles.landmarkInfo}>
                  <Text style={styles.landmarkName}>{landmark.name}</Text>
                  <Text style={styles.landmarkType}>{landmark.type}</Text>
                </View>
                <Text style={styles.landmarkDistance}>
                  {formatDistance(landmark.distance)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {propertyReviews.length > 0 && (
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>({propertyReviews.length} reviews)</Text>
                </View>
              )}
            </View>
            {propertyReviews.length > 0 ? (
              propertyReviews.map(review => {
                const reviewUser = mockUsers.find(u => u.id === review.userId);
                return reviewUser ? (
                  <ReviewCard key={review.id} review={review} user={reviewUser} />
                ) : null;
              })
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review this property!</Text>
            )}
          </View>

          {landlord && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Owner</Text>
              <View style={styles.landlordInfo}>
                <Image source={{ uri: landlord.avatar }} style={styles.landlordAvatar} />
                <View style={styles.landlordDetails}>
                  <Text style={styles.landlordName}>{landlord.name}</Text>
                  <Text style={styles.landlordBio}>{landlord.bio}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {user?.userType === 'student' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactLandlord}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
    marginTop: 60,
  },
  image: {
    width: screenWidth,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  mainInfo: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rentBadge: {
    backgroundColor: '#DBEAFE',
  },
  saleBadge: {
    backgroundColor: '#D1FAE5',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 6,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
  },
  period: {
    fontSize: 18,
    fontWeight: '400',
    color: '#6B7280',
  },
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  quickInfoItem: {
    alignItems: 'center',
  },
  quickInfoNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  landmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  landmarkInfo: {
    flex: 1,
  },
  landmarkName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  landmarkType: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  landmarkDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  landlordDetails: {
    flex: 1,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  landlordBio: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  averageRating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  noReviews: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});