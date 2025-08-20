import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, User, Chat, Message, SearchFilters } from '@/types';
import { mockProperties, mockUsers, mockChats, mockMessages, currentUser } from '@/data/mockData';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (updatedUser: User) => void;
  
  // Properties
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  
  // Chats and Messages
  chats: Chat[];
  messages: Message[];
  sendMessage: (chatId: string, content: string) => void;
  startChat: (propertyId: string, landlordId: string) => string;
  
  // Search
  searchFilters: SearchFilters;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  filteredProperties: Property[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
  });

  const isAuthenticated = !!user;

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your auth API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const sendMessage = (chatId: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const startChat = (propertyId: string, landlordId: string): string => {
    if (!user) return '';
    
    // Check if chat already exists
    const existingChat = chats.find(
      chat => chat.propertyId === propertyId && chat.studentId === user.id
    );
    
    if (existingChat) {
      return existingChat.id;
    }
    
    // Create new chat
    const newChat: Chat = {
      id: Date.now().toString(),
      propertyId,
      studentId: user.id,
      landlordId,
      createdAt: new Date().toISOString(),
    };
    
    setChats(prev => [...prev, newChat]);
    return newChat.id;
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const filteredProperties = properties.filter(property => {
    // Type filter
    if (searchFilters.type !== 'all' && property.type !== searchFilters.type) {
      return false;
    }
    
    // Price filter
    if (searchFilters.minPrice && property.price < searchFilters.minPrice) {
      return false;
    }
    if (searchFilters.maxPrice && property.price > searchFilters.maxPrice) {
      return false;
    }
    
    // City filter
    if (searchFilters.city && !property.city.toLowerCase().includes(searchFilters.city.toLowerCase())) {
      return false;
    }
    
    // Neighborhood filter
    if (searchFilters.neighborhood && !property.neighborhood.toLowerCase().includes(searchFilters.neighborhood.toLowerCase())) {
      return false;
    }
    
    // Bedrooms filter
    if (searchFilters.bedrooms && property.bedrooms < searchFilters.bedrooms) {
      return false;
    }
    
    // Amenities filter
    if (searchFilters.amenities && searchFilters.amenities.length > 0) {
      const hasAllAmenities = searchFilters.amenities.every(amenityName =>
        property.amenities.some(amenity => 
          amenity.name.toLowerCase().includes(amenityName.toLowerCase()) && amenity.available
        )
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        updateUser,
        properties,
        addProperty,
        chats,
        messages,
        sendMessage,
        startChat,
        searchFilters,
        updateSearchFilters,
        filteredProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}