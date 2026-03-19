'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jobpulse-ai-backend.onrender.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data.user);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || 'Session expired');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};