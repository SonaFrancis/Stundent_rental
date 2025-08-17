import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Property } from '../types';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  style?: any;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  style,
}) => {
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString()} FCFA/month`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image
        source={{
          uri: property.images[0] || 'https://via.placeholder.com/300x200',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {property.neighborhood}, {property.city}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Ionicons name="bed-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="water-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{property.bathrooms}</Text>
          </View>
        </View>
        <Text style={styles.price}>
          {formatPrice(property.price, property.type)}
        </Text>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>
            {property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
});