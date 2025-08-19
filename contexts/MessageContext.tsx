import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  conversationId: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  propertyId?: string;
}

interface MessageContextType {
  conversations: Conversation[];
  totalUnreadCount: number;
  markConversationAsRead: (conversationId: string) => void;
  markAllAsRead: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Mock conversations for demo purposes
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantName: 'Marie Dubois',
        participantAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastMessage: 'Is the apartment still available for viewing?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unreadCount: 2,
        propertyId: 'prop-1'
      },
      {
        id: '2',
        participantName: 'Jean Kamga',
        participantAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastMessage: 'Can you negotiate the price for the MacBook?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        unreadCount: 1,
      },
      {
        id: '3',
        participantName: 'Paul Biya',
        participantAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastMessage: 'Thank you for the information about the studio',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        propertyId: 'prop-2'
      },
      {
        id: '4',
        participantName: 'Aminata Sow',
        participantAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastMessage: 'When can we schedule a meeting to view the business?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        unreadCount: 3,
      },
      {
        id: '5',
        participantName: 'Samuel Eto\'o',
        participantAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastMessage: 'The furniture looks great, I\'m interested',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        unreadCount: 0,
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conversation => 
        conversation.id === conversationId 
          ? { ...conversation, unreadCount: 0 }
          : conversation
      )
    );
  };

  const markAllAsRead = () => {
    setConversations(prev => 
      prev.map(conversation => ({ ...conversation, unreadCount: 0 }))
    );
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        totalUnreadCount,
        markConversationAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}