import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Supabase client for development without connection
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock auth state change
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    },
    signUp: (credentials: any) => Promise.resolve({ 
      data: { 
        user: { 
          id: 'mock-user-id', 
          email: credentials.email 
        } 
      }, 
      error: null 
    }),
    signInWithPassword: (credentials: any) => Promise.resolve({ 
      data: { 
        user: { 
          id: 'mock-user-id', 
          email: credentials.email 
        } 
      }, 
      error: null 
    }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Mock data - Supabase not connected' } 
        }),
        order: (column: string, options?: any) => Promise.resolve({ 
          data: [], 
          error: null 
        }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ 
        data: [], 
        error: null 
      }),
      gte: (column: string, value: any) => ({
        lte: (column: string, value: any) => ({
          ilike: (column: string, value: any) => ({
            eq: (column: string, value: any) => ({
              order: (column: string, options?: any) => Promise.resolve({ 
                data: [], 
                error: null 
              }),
            }),
          }),
        }),
      }),
      ilike: (column: string, value: any) => Promise.resolve({ 
        data: [], 
        error: null 
      }),
      or: (condition: string) => ({
        order: (column: string, options?: any) => Promise.resolve({ 
          data: [], 
          error: null 
        }),
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ 
          data: { id: 'mock-id', ...data }, 
          error: null 
        }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: value, ...data }, 
            error: null 
          }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null }),
    }),
  }),
};