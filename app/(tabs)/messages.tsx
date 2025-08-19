import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useMessages } from '@/contexts/MessageContext';
import { mockUsers, mockProperties } from '@/data/mockData';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';

export default function MessagesScreen() {
  const { chats, messages, user } = useApp();
  const { conversations, markConversationAsRead } = useMessages();
  const router = useRouter();

  // Use conversations from message context if available, otherwise fallback to existing logic
  const chatListData = conversations.length > 0 ? conversations : chats.map(chat => {
    const property = mockProperties.find(p => p.id === chat.propertyId);
    const otherUser = mockUsers.find(u => 
      u.id === (user?.userType === 'student' ? chat.landlordId : chat.studentId)
    );
    const lastMessage = messages
      .filter(m => m.chatId === chat.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return {
      chat,
      property,
      otherUser,
      lastMessage,
    };
  });

  const renderChatItem = ({ item }: any) => {
    // Handle both conversation format (from message context) and old chat format
    const isConversation = item.participantName; // New format has participantName
    
    if (isConversation) {
      return (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => {
            if (item.unreadCount > 0) {
              markConversationAsRead(item.id);
            }
            router.push(`/chat/${item.id}`);
          }}
        >
          <Image source={{ uri: item.participantAvatar }} style={styles.avatar} />
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName}>{item.participantName}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.lastMessageTime).toLocaleDateString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage}
            </Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Old format handling
    const { chat, property, otherUser, lastMessage } = item;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${chat.id}`)}
      >
        <Image source={{ uri: otherUser?.avatar }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>{otherUser?.name}</Text>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {property?.title}
            </Text>
          </View>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={2}>
              {lastMessage.content}
            </Text>
          )}
          {lastMessage && (
            <Text style={styles.timestamp}>
              {new Date(lastMessage.timestamp).toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
        {lastMessage && !lastMessage.read && lastMessage.senderId !== user?.id && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };

  if (chatListData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.emptyState}>
          <MessageCircle size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtitle}>
            Start browsing properties and message landlords to begin conversations
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      <FlatList
        data={chatListData}
        renderItem={renderChatItem}
        keyExtractor={item => item.id || item.chat?.id}
        style={styles.chatList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
    color: '#1F2937',
    marginBottom: 2,
  },
  propertyTitle: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});