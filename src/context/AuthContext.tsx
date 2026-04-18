'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  userId: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
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

  // Load from localStorage safely (no direct setState in effect body)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');

    if (storedToken && storedUserStr) {
      try {
        const parsedUser: User = JSON.parse(storedUserStr);
        // Move setState out of synchronous effect execution
        setTimeout(() => {
          setToken(storedToken);
          setUser(parsedUser);
        }, 0);
      } catch (e) {
        console.error('Failed to parse stored user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Mark loading as false after initial check
    setTimeout(() => setLoading(false), 0);
  }, []); // Runs only once on mount

  // Fetch fresh user data if we have token but no user
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const userData: User = {
            userId: res.data.user.userId || res.data.user.id || res.data.userId,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: unknown) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setError(axiosErr.response?.data?.message || 'Session expired');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      };

      fetchUser();
    }
  }, [user]); // Only when user changes

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token: newToken, user: userFromServer } = res.data;

      const userData: User = {
        userId: userFromServer.userId || userFromServer.id,
        name: userFromServer.name,
        email: userFromServer.email,
        role: userFromServer.role,
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
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
      const { token: newToken, user: userFromServer } = res.data;

      const userData: User = {
        userId: userFromServer.userId || userFromServer.id,
        name: userFromServer.name,
        email: userFromServer.email,
        role: userFromServer.role,
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token && !!user, 
        loading, 
        error, 
        login, 
        register, 
        logout 
      }}
    >
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