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
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  MessageCircle,
  Package,
  Building2,
  DollarSign
} from 'lucide-react-native';
import { SellItem } from '@/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'landlord' | 'sales'>('overview');

  useEffect(() => {
    if (tab && ['overview', 'landlord', 'sales'].includes(tab)) {
      setActiveTab(tab as 'overview' | 'landlord' | 'sales');
    }
  }, [tab]);

  // Mock data - in a real app, this would come from API
  const mockSellItems: SellItem[] = [
    {
      id: '1',
      title: 'MacBook Pro 13 inch',
      description: 'Excellent condition, barely used',
      price: 850000,
      currency: 'FCFA',
      category: 'electronics',
      condition: 'excellent',
      location: 'Yaoundé, Bastos',
      images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400'],
      sellerId: user?.id || '1',
      available: true,
      createdAt: '2024-01-10T10:00:00Z',
      features: [
        'M1 Chip - 8 Core CPU',
        '8GB Unified Memory', 
        '256GB SSD Storage',
        '13.3" Retina Display',
        'Touch Bar & Touch ID',
        'Two Thunderbolt Ports',
        'All-day battery life',
        'macOS Monterey'
      ]
    },
    {
      id: '2',
      title: 'Dining Table Set',
      description: '6-seater wooden dining table with chairs',
      price: 120000,
      currency: 'FCFA',
      category: 'furniture',
      condition: 'good',
      location: 'Douala, Akwa',
      images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'],
      sellerId: user?.id || '1',
      available: true,
      createdAt: '2024-01-08T14:30:00Z',
    }
  ];

  const handleEditItem = (item: SellItem) => {
    router.push(`/sell-item?category=${item.category}&edit=${item.id}`);
  };

  const handleDeleteItem = (item: SellItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete from backend
            Alert.alert('Success', 'Item deleted successfully');
          }
        }
      ]
    );
  };

  const handleToggleAvailability = (item: SellItem) => {
    const action = item.available ? 'mark as sold' : 'mark as available';
    Alert.alert(
      'Update Item',
      `Do you want to ${action}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            // In a real app, this would update in backend
            Alert.alert('Success', `Item ${item.available ? 'marked as sold' : 'marked as available'}`);
          }
        }
      ]
    );
  };

  const renderStatsCard = (title: string, value: string, icon: React.ReactNode, color: string) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <Text style={styles.statsTitle}>{title}</Text>
        <Text style={styles.statsValue}>{value}</Text>
      </View>
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to your Dashboard!</Text>
        <Text style={styles.welcomeText}>
          Manage your listings, track performance, and connect with buyers
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {renderStatsCard('Active Items', '2', <Package size={20} color="#3B82F6" />, '#3B82F6')}
        {renderStatsCard('Total Views', '47', <Eye size={20} color="#10B981" />, '#10B981')}
        {renderStatsCard('Messages', '12', <MessageCircle size={20} color="#F59E0B" />, '#F59E0B')}
        {renderStatsCard('Total Earned', '0', <DollarSign size={20} color="#EF4444" />, '#EF4444')}
      </View>

      <TouchableOpacity 
        style={styles.addNewButton}
        onPress={() => router.push('/sell-item?category=electronics')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addNewButtonText}>Add New Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemCard = ({ item }: { item: SellItem }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} {item.currency}</Text>
        <Text style={styles.itemLocation}>{item.location}</Text>
        
        {/* Features & Specifications for Electronics */}
        {item.category === 'electronics' && item.features && item.features.length > 0 && (
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Features & Specifications</Text>
            {item.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText} numberOfLines={1}>{feature}</Text>
              </View>
            ))}
            {item.features.length > 3 && (
              <Text style={styles.moreFeatures}>+{item.features.length - 3} more features</Text>
            )}
          </View>
        )}
        
        <View style={styles.itemStatus}>
          <View style={[
            styles.statusBadge,
            item.available ? styles.availableBadge : styles.soldBadge
          ]}>
            <Text style={[
              styles.statusText,
              item.available ? styles.availableText : styles.soldText
            ]}>
              {item.available ? 'Available' : 'Sold'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleAvailability(item)}
        >
          <Eye size={16} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditItem(item)}
        >
          <Edit3 size={16} color="#3B82F6" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteItem(item)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItems = () => (
    <View style={styles.tabContent}>
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsTitle}>Your Items</Text>
        <TouchableOpacity 
          style={styles.addItemButton}
          onPress={() => router.push('/sell-item?category=electronics')}
        >
          <Plus size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockSellItems}
        renderItem={renderItemCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No items yet</Text>
            <Text style={styles.emptyStateSubtext}>Start by adding your first item for sale</Text>
          </View>
        }
      />
    </View>
  );

  const renderLandlordTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Property Rentals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/post-property')}
        >
          <Plus size={16} color="#3B82F6" />
          <Text style={styles.addButtonText}>Add Property</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoCard}>
        <Building2 size={32} color="#3B82F6" />
        <View style={styles.infoCardContent}>
          <Text style={styles.infoCardTitle}>Post Any Property Type</Text>
          <Text style={styles.infoCardText}>
            List apartments, houses, rooms, studios, or any rental property. 
            Simply specify the type in your property title.
          </Text>
        </View>
      </View>
      
      <Text style={styles.recentTitle}>Recent Properties</Text>
      <View style={styles.emptyState}>
        <Building2 size={48} color="#D1D5DB" />
        <Text style={styles.emptyStateText}>No properties yet</Text>
        <Text style={styles.emptyStateSubtext}>Click "Add Property" to post your first rental listing</Text>
      </View>
    </View>
  );

  const renderSalesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Items for Sale</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/post-sale-item')}
        >
          <Plus size={16} color="#10B981" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryGrid}>
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=land')}
        >
          <Package size={24} color="#16A34A" />
          <Text style={styles.categoryCardText}>Land</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=house')}
        >
          <Building2 size={24} color="#3B82F6" />
          <Text style={styles.categoryCardText}>Houses</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=electronics')}
        >
          <Package size={24} color="#F59E0B" />
          <Text style={styles.categoryCardText}>Electronics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=furniture')}
        >
          <Package size={24} color="#A855F7" />
          <Text style={styles.categoryCardText}>Furniture</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=vehicles')}
        >
          <Package size={24} color="#EF4444" />
          <Text style={styles.categoryCardText}>Vehicles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => router.push('/post-sale-item?category=business')}
        >
          <Package size={24} color="#10B981" />
          <Text style={styles.categoryCardText}>Business</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.recentTitle}>Recent Items</Text>
      {renderSellItems()}
    </View>
  );

  const renderSellItems = () => (
    <FlatList
      data={mockSellItems}
      renderItem={renderItemCard}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Package size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No items yet</Text>
          <Text style={styles.emptyStateSubtext}>Start by adding your first item for sale</Text>
        </View>
      }
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dashboard</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'landlord' && styles.activeTab]}
          onPress={() => setActiveTab('landlord')}
        >
          <Text style={[styles.tabText, activeTab === 'landlord' && styles.activeTabText]}>
            Rentals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sales' && styles.activeTab]}
          onPress={() => setActiveTab('sales')}
        >
          <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>
            Sales
          </Text>
        </TouchableOpacity>
        
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'landlord' && renderLandlordTab()}
        {activeTab === 'sales' && renderSalesTab()}
      </ScrollView>
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statsIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addNewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  featuresSection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  featureBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  featureText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  moreFeatures: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemStatus: {
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
  },
  soldBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  availableText: {
    color: '#166534',
  },
  soldText: {
    color: '#991B1B',
  },
  itemActions: {
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  categoryCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    gap: 16,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  infoCardText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});