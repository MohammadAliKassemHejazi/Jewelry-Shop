"use client";
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loginUser, registerUser, getSession, logoutUser, User } from '../store/slices/userSlice';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Check if user is already logged in
    dispatch(getSession());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginUser({ email, password }));
      return result.type.endsWith('fulfilled');
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const result = await dispatch(registerUser(userData));
      return result.type.endsWith('fulfilled');
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin' || user?.isAdmin === true,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};