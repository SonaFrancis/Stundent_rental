import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

interface TabIconWithBadgeProps {
  size: number;
  color: string;
  badgeCount: number;
}

export function TabIconWithBadge({ size, color, badgeCount }: TabIconWithBadgeProps) {
  return (
    <View style={styles.container}>
      <MessageCircle size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});