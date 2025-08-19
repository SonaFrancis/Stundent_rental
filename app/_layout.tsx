import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MessageProvider } from '@/contexts/MessageContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <NotificationProvider>
        <MessageProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="property/[id]" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="add-property" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </MessageProvider>
      </NotificationProvider>
    </AppProvider>
  );
}