import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authApi.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      // Token exists, user is likely authenticated
      // We don't have a /me endpoint, so we just mark as authenticated
      // The token will be validated on the first API call
      setUser({ id: '', email: '', full_name: '', created_at: '' });
    } catch {
      await authApi.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.user);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const response = await authApi.register(email, password, fullName);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsGuest(false);
  }, []);

  const skipAuth = useCallback(() => {
    setIsGuest(true);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isGuest, isLoading, login, register, logout, skipAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
