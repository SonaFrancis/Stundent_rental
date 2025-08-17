import { Message, Chat } from '../types';

// Mock data for development
let mockChats: Chat[] = [];
let mockMessages: Message[] = [];

export const chatService = {
  // Get all chats for a user
  async getChats(userId: string): Promise<Chat[]> {
    // Return mock chats for development
    return mockChats.filter(chat => 
      chat.student_id === userId || chat.landlord_id === userId
    );
  },

  // Get or create chat
  async getOrCreateChat(propertyId: string, studentId: string, landlordId: string): Promise<Chat> {
    // Check for existing chat
    const existingChat = mockChats.find(chat =>
      chat.property_id === propertyId &&
      chat.student_id === studentId &&
      chat.landlord_id === landlordId
    );

    if (existingChat) {
      return existingChat;
    }

    // Create new mock chat
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      property_id: propertyId,
      student_id: studentId,
      landlord_id: landlordId,
      property: {
        id: propertyId,
        title: 'Sample Property',
        description: 'Mock property for chat',
        type: 'rent',
        price: 100000,
        city: 'Yaoundé',
        neighborhood: 'Mock Area',
        street_name: 'Mock Street',
        amenities: [],
        nearby_landmarks: [],
        images: [],
        landlord_id: landlordId,
        bedrooms: 1,
        bathrooms: 1,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      other_user: {
        id: landlordId,
        email: 'landlord@example.com',
        full_name: 'Mock Landlord',
        user_type: 'landlord',
        created_at: new Date().toISOString(),
      },
    };
    
    mockChats.push(newChat);
    return newChat;
  },

  // Get messages for a chat
  async getMessages(chatId: string): Promise<Message[]> {
    return mockMessages.filter(msg => msg.property_id === chatId);
  },

  // Send message
  async sendMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      property_id: chatId,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
      read: false,
    };
    
    mockMessages.push(newMessage);
    
    // Update chat's last message
    const chatIndex = mockChats.findIndex(chat => chat.id === chatId);
    if (chatIndex !== -1) {
      mockChats[chatIndex].last_message = content;
      mockChats[chatIndex].last_message_at = new Date().toISOString();
    }
    
    return newMessage;
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    mockMessages.forEach(msg => {
      if (msg.property_id === chatId && msg.receiver_id === userId && !msg.read) {
        msg.read = true;
      }
    });
  },
};