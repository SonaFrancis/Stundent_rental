import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';
import { Chat } from '../types';

interface MessagesScreenProps {
  navigation: any;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      const data = await chatService.getChats(user.id);
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadChats();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const otherUser = user?.id === item.student_id ? item.landlord : item.student;
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('Chat', {
            chatId: item.id,
            property: item.property,
            otherUser,
          })
        }
      >
        <View style={styles.avatarContainer}>
          {otherUser?.avatar_url ? (
            <Image source={{ uri: otherUser.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#4F46E5" />
            </View>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>{otherUser?.full_name || 'Unknown User'}</Text>
            {item.last_message_at && (
              <Text style={styles.timestamp}>
                {formatTime(item.last_message_at)}
              </Text>
            )}
          </View>
          
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.property?.title || 'Property'}
          </Text>
          
          {item.last_message && (
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.last_message}
            </Text>
          )}
        </View>

        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Messages Yet</Text>
            <Text style={styles.emptyText}>
              Start browsing properties and contact landlords to begin conversations
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  propertyTitle: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});