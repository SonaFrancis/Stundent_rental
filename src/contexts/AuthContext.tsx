import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { User } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      try {
        const sessionData = response?.data?.session || null;
        setSession(sessionData);
        if (sessionData?.user) {
          fetchUserProfile(sessionData.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      try {
        if (authListener?.data?.subscription?.unsubscribe) {
          authListener.data.subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Error unsubscribing from auth listener:', error);
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const mockUser = {
        id: userId,
        email: 'student@example.com',
        full_name: 'John Doe',
        user_type: 'student' as 'student' | 'landlord',
        phone: '+237123456789',
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const mockData = {
      user: {
        id: 'mock-user-' + Date.now(),
        email,
      },
    };
    
    setTimeout(() => {
      fetchUserProfile(mockData.user.id);
    }, 100);
    
    return mockData;
  };

  const signIn = async (email: string, password: string) => {
    const mockData = {
      user: {
        id: 'mock-user-' + Date.now(),
        email,
      },
    };
    
    setTimeout(() => {
      fetchUserProfile(mockData.user.id);
    }, 100);
    
    return mockData;
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};