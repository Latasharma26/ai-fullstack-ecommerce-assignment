import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithDemo: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'shopai_token';
const USER_KEY = 'shopai_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const currentUser = await authService.fetchCurrentUser();
          setUser(currentUser);
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (tokenStr: string, loggedInUser: User) => {
    setToken(tokenStr);
    setUser(loggedInUser);
    localStorage.setItem(TOKEN_KEY, tokenStr);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    try {
      const data = await authService.loginWithGoogle(credential);
      handleLoginSuccess(data.access_token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = async (email: string) => {
    setIsLoading(true);
    try {
      const data = await authService.loginWithDemo(email);
      handleLoginSuccess(data.access_token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginWithDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
