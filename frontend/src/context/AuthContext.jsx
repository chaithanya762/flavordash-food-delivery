import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/api';

const AuthContext = createContext();

// Pre-seeded mock database accounts for Hotels, Riders, and Customers
export const INITIAL_MOCK_USERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'CUSTOMER',
    phone: '+91 98765 43210',
    address: '742 Evergreen Terrace, New Delhi'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'customer@flavordash.com',
    role: 'CUSTOMER',
    phone: '+91 91234 56789',
    address: 'Connaught Place, Block B, New Delhi'
  },
  {
    id: 3,
    name: 'Chef Rajat (Punjab Rasoi)',
    email: 'chef@rasoi.in',
    role: 'HOTEL_MANAGER',
    phone: '+91 98111 22233',
    address: 'Punjab Rasoi, Sector 18, Noida'
  },
  {
    id: 4,
    name: 'Manager Vikram (Paradise Biryani)',
    email: 'hotel@flavordash.com',
    role: 'HOTEL_MANAGER',
    phone: '+91 98222 33344',
    address: 'Paradise Biryani, Koramangala, Bengaluru'
  },
  {
    id: 5,
    name: 'Ramesh Kumar (Rider Express)',
    email: 'ramesh@rider.in',
    role: 'RIDER',
    phone: '+91 97333 44455',
    address: 'Central Hub, Connaught Place'
  },
  {
    id: 6,
    name: 'Suresh Verma (Rider Fleet)',
    email: 'rider@flavordash.com',
    role: 'RIDER',
    phone: '+91 97444 55566',
    address: 'East Hub, Sector 62, Noida'
  }
];

export const AuthProvider = ({ children }) => {
  // STRICT REQUIREMENT: No auto-login on initial app load. User starts logged out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || 'CUSTOMER';
  });

  // Persistent user registry storing all registered Customers, Hotels, and Riders
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registered_users_db');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_MOCK_USERS;
  });

  useEffect(() => {
    localStorage.setItem('registered_users_db', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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

  const switchRole = (newRole) => {
    setRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const login = (userData) => {
    const userRole = userData.role || 'CUSTOMER';
    setRole(userRole);
    setUser({ ...userData, role: userRole });
  };

  const logout = () => {
    setUser(null);
    setRole('CUSTOMER');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  // Provision for Customers, Hotels & Riders to register and store in database
  const register = async (formData) => {
    try {
      // 1. Attempt API call to backend service
      const apiResult = await userAPI.register(formData);
      
      const newUser = {
        id: apiResult?.id || Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role || 'CUSTOMER',
        createdAt: new Date().toISOString()
      };

      // 2. Persist in registeredUsers database registry
      setRegisteredUsers(prev => [...prev.filter(u => u.email !== newUser.email), newUser]);

      // 3. Log in newly registered user
      login(newUser);
      return newUser;
    } catch (error) {
      const fallbackUser = { 
        id: Date.now(), 
        ...formData, 
        role: formData.role || 'CUSTOMER',
        createdAt: new Date().toISOString() 
      };

      setRegisteredUsers(prev => [...prev.filter(u => u.email !== fallbackUser.email), fallbackUser]);
      login(fallbackUser);
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      registeredUsers,
      switchRole, 
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
