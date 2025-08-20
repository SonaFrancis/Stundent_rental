import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface SellItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
}

interface SellItemCardProps {
  item: SellItem;
}

const categories = [
  { id: 'land', name: 'Land' },
  { id: 'house', name: 'Houses' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'business', name: 'Business' },
];

export function SellItemCard({ item }: SellItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/sell-item-detail/${item.id}`);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Item';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      )}
      <View style={[
        styles.content,
        (!item.images || item.images.length === 0) && styles.contentWithoutImage
      ]}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.price}>
          {item.price.toLocaleString()} FCFA
        </Text>
        
        <Text style={styles.location}>
          {item.location}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>
            {getCategoryName(item.category)}
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
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  contentWithoutImage: {
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
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
    marginBottom: 12,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});