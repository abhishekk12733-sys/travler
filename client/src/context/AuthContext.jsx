import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, verify token with backend
      setUser({ id: '1', username: 'demo_user', email: 'demo@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - in real app, this would call your backend
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = { id: '1', username: 'demo_user', email };
        const mockToken = 'mock_jwt_token';
        
        localStorage.setItem('token', mockToken);
        setUser(mockUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, email, password) => {
    try {
      // Mock signup - in real app, this would call your backend
      const mockUser = { id: Date.now().toString(), username, email };
      const mockToken = 'mock_jwt_token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};