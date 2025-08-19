import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Get the URL and anon key from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// If credentials are not provided, use a mock client for development
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock client for development.');
  
  // Export mock client for development
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
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
} else {
  // Create real Supabase client
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}