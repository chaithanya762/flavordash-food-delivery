import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/api';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "555-0199",
  address: "742 Evergreen Terrace"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
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
      // Fallback local registration if backend fails
      const fallbackUser = { id: Date.now(), ...formData };
      login(fallbackUser);
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
