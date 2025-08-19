import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MapPin, 
  Phone, 
  MessageCircle,
  Star,
  Calendar,
  Tag,
  User
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SellItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Mock data - in a real app, this would come from API based on the id
  const mockSellItems = {
    'sell-1': {
      id: 'sell-1',
      title: 'MacBook Pro 13 inch',
      description: 'Excellent condition MacBook Pro with M1 chip. Perfect for developers and students. Includes original charger, box, and documentation. Battery health is at 95%. No scratches or dents.',
      price: 850000,
      category: 'electronics',
      condition: 'excellent',
      location: 'Yaoundé, Bastos',
      contactPhone: '+237 650 123 456',
      images: [
        'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      seller: {
        id: '2',
        name: 'John Kamdem',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.8,
        verified: true
      },
      createdAt: '2024-01-10T10:00:00Z',
      features: [
        'M1 Chip - 8 Core CPU',
        '8GB Unified Memory',
        '256GB SSD Storage',
        '13.3" Retina Display',
        'Touch Bar & Touch ID',
        'Two Thunderbolt Ports'
      ]
    },
    'sell-2': {
      id: 'sell-2',
      title: 'Toyota Camry 2018',
      description: 'Well maintained Toyota Camry in excellent condition. Single owner, regular service records available. Clean interior and exterior. All documentation up to date.',
      price: 12000000,
      category: 'vehicles',
      condition: 'excellent',
      location: 'Douala, Akwa',
      contactPhone: '+237 677 234 567',
      images: [
        'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      seller: {
        id: '3',
        name: 'Marie Ngono',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.9,
        verified: true
      },
      createdAt: '2024-01-08T14:30:00Z',
      features: [
        '2.5L 4-Cylinder Engine',
        'Automatic Transmission',
        'LED Headlights',
        'Backup Camera',
        'Bluetooth Connectivity',
        'Leather Seats'
      ]
    },
    'sell-3': {
      id: 'sell-3',
      title: 'Dining Table Set',
      description: 'Beautiful 6-seater wooden dining table set with matching chairs. Made from solid mahogany wood. Perfect for family dining. Chairs have comfortable cushioned seats.',
      price: 120000,
      category: 'furniture',
      condition: 'good',
      location: 'Yaoundé, Mfandena',
      contactPhone: '+237 694 345 678',
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      seller: {
        id: '4',
        name: 'Paul Mbida',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.6,
        verified: false
      },
      createdAt: '2024-01-05T09:15:00Z',
      features: [
        'Solid Mahogany Wood',
        'Seats 6 People',
        'Cushioned Chairs',
        'Scratch Resistant Finish',
        'Easy to Clean',
        'Dimensions: 180cm x 90cm'
      ]
    }
  };

  const item = mockSellItems[id as keyof typeof mockSellItems];

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${item.contactPhone}`);
  };

  const handleMessage = () => {
    router.push(`/chat/sell-${item.id}`);
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(isSaved ? 'Removed from saved' : 'Added to saved', '');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} color="#F59E0B" fill="#F59E0B" style={{ opacity: 0.5 }} />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} color="#D1D5DB" />);
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Heart size={20} color={isSaved ? "#EF4444" : "#6B7280"} fill={isSaved ? "#EF4444" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              const index = Math.round(nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {item.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          
          {item.images.length > 1 && (
            <View style={styles.imageIndicator}>
              <Text style={styles.imageIndicatorText}>
                {currentImageIndex + 1} / {item.images.length}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.itemInfo}>
          {/* Price and Title */}
          <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>
          <Text style={styles.title}>{item.title}</Text>
          
          {/* Location and Date */}
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.metaText}>Posted {formatDate(item.createdAt)}</Text>
            </View>
          </View>

          {/* Condition */}
          <View style={styles.conditionContainer}>
            <Tag size={16} color="#10B981" />
            <Text style={styles.conditionText}>
              Condition: {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Features */}
          {item.features && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features & Specifications</Text>
              {item.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerCard}>
              <Image source={{ uri: item.seller.avatar }} style={styles.sellerAvatar} />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameContainer}>
                  <Text style={styles.sellerName}>{item.seller.name}</Text>
                  {item.seller.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {renderStars(item.seller.rating)}
                  </View>
                  <Text style={styles.ratingText}>({item.seller.rating})</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Contact Buttons */}
      <View style={styles.contactButtons}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
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
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  itemInfo: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 26,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  conditionText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  featureText: {
    fontSize: 15,
    color: '#4B5563',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
  },
});