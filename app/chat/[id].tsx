import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput,
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { mockUsers, mockProperties } from '@/data/mockData';
import { ChatBubble } from '@/components/ChatBubble';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chats, messages, user, sendMessage } = useApp();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chat = chats.find(c => c.id === id);
  const chatMessages = messages.filter(m => m.chatId === id);
  const property = mockProperties.find(p => p.id === chat?.propertyId);
  const otherUser = mockUsers.find(u => 
    u.id === (user?.userType === 'student' ? chat?.landlordId : chat?.studentId)
  );
  
  const getUserRoleLabel = (userType: string) => {
    return userType === 'student' ? 'Tenant' : 'Landlord/Caretaker';
  };

  if (!chat || !otherUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Chat not found</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(chat.id, newMessage.trim());
      setNewMessage('');
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{otherUser.name}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {getUserRoleLabel(otherUser.userType)}
          </Text>
          {otherUser.userType === 'landlord' && property && (
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {property.title}
            </Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={({ item }) => {
            const messageUser = mockUsers.find(u => u.id === item.senderId);
            return (
              <ChatBubble 
                message={item} 
                isCurrentUser={item.senderId === user?.id}
                user={messageUser}
              />
            );
          }}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? "#FFFFFF" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
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
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  propertyTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
});