import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success && res.data.data) {
      const { accessToken, user: loggedInUser } = res.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setToken(accessToken);
      setUser(loggedInUser);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role) => {
    const demoCredentials = {
      STUDENT: { email: 'sailesh@edtech.com', password: 'Password123!' },
      MENTOR: { email: 'viji@edtech.com', password: 'Password123!' },
      INSTITUTION_ADMIN: { email: 'institution@edtech.com', password: 'Password123!' },
      SUPER_ADMIN: { email: 'admin@edtech.com', password: 'Password123!' },
      SAILESH: { email: 'sailesh@edtech.com', password: 'Password123!' },
      SUJITHA: { email: 'sujitha@edtech.com', password: 'Password123!' },
      ISAAC: { email: 'isaac@edtech.com', password: 'Password123!' },
      HARRISH: { email: 'harrish@edtech.com', password: 'Password123!' },
      PRAVEEN: { email: 'praveen@edtech.com', password: 'Password123!' },
      VIJI: { email: 'viji@edtech.com', password: 'Password123!' },
    };

    const creds = demoCredentials[role] || demoCredentials.STUDENT;
    return await login(creds.email, creds.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
