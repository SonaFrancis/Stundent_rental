import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Property } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { useRouter } from 'expo-router';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: property.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {property.title}
          </Text>
          <View style={[styles.statusBadge, property.available ? styles.availableBadge : styles.notAvailableBadge]}>
            <Text style={[styles.statusText, property.available ? styles.availableText : styles.notAvailableText]}>
              {property.available ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.location}>
          {property.neighborhood}, {property.city}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {property.description}
        </Text>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {property.bedrooms} bed • {property.bathrooms} bath • {property.squareMeters}m²
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>
            {formatCurrency(property.price)}
            {property.type === 'rent' && <Text style={styles.period}>/month</Text>}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
  },
  notAvailableBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  availableText: {
    color: '#166534',
  },
  notAvailableText: {
    color: '#991B1B',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  period: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});