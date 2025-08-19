import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { X, Home, Building2, Sofa, Car, Briefcase, Package } from 'lucide-react-native';

interface SellCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

export const SellCategoryModal: React.FC<SellCategoryModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'land',
      title: 'Landed Property',
      description: 'Plots, farmland, commercial land',
      icon: Building2,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      id: 'house',
      title: 'Houses & Apartments',
      description: 'Residential properties for sale',
      icon: Home,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      id: 'furniture',
      title: 'Furniture & Home Items',
      description: 'Beds, chairs, tables, appliances',
      icon: Sofa,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      id: 'electronics',
      title: 'Electronics',
      description: 'Phones, laptops, TVs, gadgets',
      icon: Package,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      description: 'Cars, motorcycles, trucks',
      icon: Car,
      color: '#EF4444',
      bgColor: '#FEF2F2',
    },
    {
      id: 'business',
      title: 'Business & Services',
      description: 'Equipment, tools, business assets',
      icon: Briefcase,
      color: '#6B7280',
      bgColor: '#F9FAFB',
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>What do you want to sell?</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Choose the category that best describes your item
        </Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.bgColor }]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                  <category.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your listing will be visible to thousands of potential buyers
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});