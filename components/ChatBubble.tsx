import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message, User } from '@/types';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  user?: User;
}

export function ChatBubble({ message, isCurrentUser, user }: ChatBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.message,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={[
        styles.timestamp,
        isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  currentUserBubble: {
    backgroundColor: '#3B82F6',
  },
  otherUserBubble: {
    backgroundColor: '#F3F4F6',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserMessage: {
    color: '#FFFFFF',
  },
  otherUserMessage: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: '#6B7280',
    textAlign: 'right',
  },
  otherUserTimestamp: {
    color: '#6B7280',
    textAlign: 'left',
  },
});