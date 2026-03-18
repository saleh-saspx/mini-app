'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { storage } from '@/lib/storage';
import type { LoginResponse } from '@/types';

type AuthContextType = {
  token: string | null;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setToken(storage.getToken());
    setUsername(storage.getUsername());
    setLoading(false);
  }, []);

  const login = async (usernameValue: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/login', {
      username: usernameValue,
      password
    });

    storage.setToken(data.token);
    storage.setUsername(usernameValue);
    setToken(data.token);
    setUsername(usernameValue);
    router.push('/');
  };

  const logout = () => {
    storage.clearToken();
    storage.clearUsername();
    setToken(null);
    setUsername(null);
    router.push('/login');
  };

  const value = useMemo(
    () => ({
      token,
      username,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [token, username, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
