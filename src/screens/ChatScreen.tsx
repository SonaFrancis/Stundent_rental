import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { GiftedChat, IMessage, User as GiftedChatUser } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';
import { Property, User, Message } from '../types';

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      chatId: string;
      property: Property;
      otherUser: User;
    };
  };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { chatId, property, otherUser } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(chatId);
      const formattedMessages = data.map((msg: Message) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.sender_id,
          name: msg.sender_id === user?.id ? user.full_name : otherUser.full_name,
        },
      }));
      setMessages(formattedMessages.reverse());
      
      // Mark messages as read
      if (user) {
        await chatService.markMessagesAsRead(chatId, user.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!user) return;

    const message = newMessages[0];
    try {
      await chatService.sendMessage(
        chatId,
        user.id,
        otherUser.id,
        message.text
      );
      
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  }, [chatId, user, otherUser]);

  const renderCustomHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          {otherUser.avatar_url ? (
            <Image source={{ uri: otherUser.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#4F46E5" />
            </View>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.userName}>{otherUser.full_name}</Text>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.title}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => navigation.navigate('PropertyDetails', { property })}
      >
        <Ionicons name="information-circle-outline" size={24} color="#4F46E5" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderCustomHeader()}
      
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user?.id || '',
          name: user?.full_name || '',
        }}
        renderAvatar={null}
        showUserAvatar={false}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <Ionicons name="chevron-down" size={20} color="#4F46E5" />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  propertyTitle: {
    fontSize: 12,
    color: '#666',
  },
  infoButton: {
    marginLeft: 12,
  },
});