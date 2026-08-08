'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchGuestLogin, fetchUserProfile, updateUserProfile, loginWithEmail, registerWithEmail, loginWithGoogle, UserProfile } from '@/lib/api-client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  loginUser: (email: string, password?: string) => Promise<void>;
  registerUser: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogleUser: (data: { credential?: string; accessToken?: string; email?: string; name?: string; avatar?: string; googleId?: string }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginAsGuest: async () => {},
  loginUser: async () => {},
  registerUser: async () => {},
  loginWithGoogleUser: async () => {},
  updateUser: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('guest_token') || localStorage.getItem('auth_token');
      if (token) {
        const profile = await fetchUserProfile();
        setUser(profile);
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const loginAsGuest = async () => {
    setIsLoading(true);
    const res = await fetchGuestLogin();
    localStorage.setItem('guest_token', res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const loginUser = async (email: string, password?: string) => {
    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    localStorage.setItem('auth_token', res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const registerUser = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    const res = await registerWithEmail(name, email, password);
    localStorage.setItem('auth_token', res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const loginWithGoogleUser = async (data: { credential?: string; accessToken?: string; email?: string; name?: string; avatar?: string; googleId?: string }) => {
    setIsLoading(true);
    const res = await loginWithGoogle(data);
    localStorage.setItem('auth_token', res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    const updated = await updateUserProfile(data);
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('guest_token');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAsGuest,
        loginUser,
        registerUser,
        loginWithGoogleUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
