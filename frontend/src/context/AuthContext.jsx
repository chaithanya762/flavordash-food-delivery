import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/api';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "555-0199",
  address: "742 Evergreen Terrace",
  role: "CUSTOMER" // CUSTOMER, HOTEL_MANAGER, RIDER
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || 'CUSTOMER';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const switchRole = (newRole) => {
    setRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (userData) => {
    setUser({ ...userData, role: role || 'CUSTOMER' });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (formData) => {
    try {
      const newUser = await userAPI.register(formData);
      login(newUser);
      return newUser;
    } catch (error) {
      const fallbackUser = { id: Date.now(), role, ...formData };
      login(fallbackUser);
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      theme, 
      switchRole, 
      toggleTheme, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
