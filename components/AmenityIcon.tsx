import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, Droplets, Wifi, ChefHat, Snowflake, Car, Chrome as Home, Video as LucideIcon } from 'lucide-react-native';

interface AmenityIconProps {
  name: string;
  icon: string;
  available: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  'zap': Zap,
  'droplets': Droplets,
  'wifi': Wifi,
  'chef-hat': ChefHat,
  'snowflake': Snowflake,
  'car': Car,
  'home': Home,
};

export function AmenityIcon({ 
  name, 
  icon, 
  available, 
  size = 'medium', 
  showLabel = true 
}: AmenityIconProps) {
  const IconComponent = iconMap[icon] || Home;
  
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconColor = available ? '#10B981' : '#D1D5DB';
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        available ? styles.availableContainer : styles.unavailableContainer
      ]}>
        <IconComponent size={iconSize} color={iconColor} />
      </View>
      {showLabel && (
        <Text style={[
          styles.label,
          available ? styles.availableLabel : styles.unavailableLabel
        ]}>
          {name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 60,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  availableContainer: {
    backgroundColor: '#ECFDF5',
  },
  unavailableContainer: {
    backgroundColor: '#F9FAFB',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  availableLabel: {
    color: '#047857',
    fontWeight: '500',
  },
  unavailableLabel: {
    color: '#6B7280',
  },
});