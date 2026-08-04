import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/api';

const AuthContext = createContext();

// Complete pre-seeded mock database accounts for ALL Restaurants in menu & Riders & Customers
export const INITIAL_MOCK_USERS = [
  // CUSTOMERS
  { id: 1, name: 'Chaithanya Gowda', email: 'chaithanyagowda762@gmail.com', role: 'CUSTOMER', phone: '+91 9591791336', address: 'JP Nagar, Mahadevapura, Mysore' },
  { id: 2, name: 'Priya Sharma', email: 'customer@flavordash.com', role: 'CUSTOMER', phone: '+91 91234 56789', address: 'JP Nagar, Mahadevapura, Mysore' },

  // HOTEL MANAGERS (ALL 18 MENU RESTAURANTS)
  { id: 101, name: 'Chef Rajat (Punjab Rasoi)', email: 'chef@rasoi.in', role: 'HOTEL_MANAGER', restaurantName: 'Punjab Rasoi', phone: '+91 98111 22233', address: 'Punjab Rasoi, Sector 18, Noida' },
  { id: 102, name: 'Manager Vikram (Paradise Biryani)', email: 'hotel@flavordash.com', role: 'HOTEL_MANAGER', restaurantName: 'Paradise Biryani', phone: '+91 98222 33344', address: 'Paradise Biryani, Koramangala, Bengaluru' },
  { id: 103, name: 'Chef Anil (Haveli North Indian)', email: 'haveli@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Haveli North Indian', phone: '+91 98333 44455', address: 'Haveli North Indian, Sector 62, Noida' },
  { id: 104, name: 'Chef Gurpreet (Dhaba 1986)', email: 'dhaba1986@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Dhaba 1986', phone: '+91 98444 55566', address: 'Dhaba 1986, Connaught Place, New Delhi' },
  { id: 105, name: 'Chef Mohan (Tandoor Grill)', email: 'tandoor@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Tandoor Grill', phone: '+91 98555 66677', address: 'Tandoor Grill, Saket, New Delhi' },
  { id: 106, name: 'Chef Tariq (Kashmiri Zaika)', email: 'kashmiri@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Kashmiri Zaika', phone: '+91 98666 77788', address: 'Kashmiri Zaika, Greater Kailash, New Delhi' },
  { id: 107, name: 'Manager Zubair (Behrouz Biryani)', email: 'behrouz@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Behrouz Biryani', phone: '+91 98777 88899', address: 'Behrouz Biryani, Cyber Hub, Gurugram' },
  { id: 108, name: 'Chef Sundaram (MTR 1924)', email: 'mtr1924@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'MTR 1924', phone: '+91 98888 99900', address: 'MTR 1924, Indiranagar, Bengaluru' },
  { id: 109, name: 'Chef Raman (Saravana Bhavan)', email: 'saravana@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Saravana Bhavan', phone: '+91 98999 00011', address: 'Saravana Bhavan, Janpath, New Delhi' },
  { id: 110, name: 'Chef Venkat (Sagar Ratna)', email: 'sagarratna@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Sagar Ratna', phone: '+91 98000 11122', address: 'Sagar Ratna, Defence Colony, New Delhi' },
  { id: 111, name: 'Vendor Munna (Juhu Chowpatty Corner)', email: 'juhu@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Juhu Chowpatty Corner', phone: '+91 97111 22233', address: 'Juhu Chowpatty, Mumbai' },
  { id: 112, name: 'Chef Sita Ram (Sita Ram Diwan Chand)', email: 'sitaram@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Sita Ram Diwan Chand', phone: '+91 97222 33344', address: 'Paharganj, New Delhi' },
  { id: 113, name: 'Mithaiwala Haldiram (Chandni Chowk Sweets)', email: 'chandnichowk@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Chandni Chowk Sweets', phone: '+91 97333 44455', address: 'Chandni Chowk, Old Delhi' },
  { id: 114, name: 'Chef Banerji (KC Das Sweets)', email: 'kcdas@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'KC Das Sweets', phone: '+91 97444 55566', address: 'Esplanade, Kolkata' },
  { id: 115, name: 'Manager Agarwal (Haldiram Sweets)', email: 'haldiram@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Haldiram Sweets', phone: '+91 97555 66677', address: 'Lajpat Nagar, New Delhi' },
  { id: 116, name: 'Manager Balwinder (Amritsari Lassi Bar)', email: 'amritsari@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Amritsari Lassi Bar', phone: '+91 97666 77788', address: 'Hall Bazaar, Amritsar' },
  { id: 117, name: 'Manager Nitin (Chaayos)', email: 'chaayos@hotel.in', role: 'HOTEL_MANAGER', restaurantName: 'Chaayos', phone: '+91 97777 88899', address: 'Cyber Hub, Gurugram' },

  // RIDERS
  { id: 201, name: 'Ramesh Kumar (Rider Express)', email: 'ramesh@rider.in', role: 'RIDER', phone: '+91 97333 44455', address: 'Central Hub, Connaught Place' },
  { id: 202, name: 'Suresh Verma (Rider Fleet)', email: 'rider@flavordash.com', role: 'RIDER', phone: '+91 97444 55566', address: 'East Hub, Sector 62, Noida' },
  { id: 203, name: 'Vikram Singh (Rider Speed)', email: 'vikram@rider.in', role: 'RIDER', phone: '+91 97555 66677', address: 'South Hub, Saket' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || 'CUSTOMER';
  });

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

  const register = async (formData) => {
    try {
      const apiResult = await userAPI.register(formData);
      
      const newUser = {
        id: apiResult?.id || Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role || 'CUSTOMER',
        restaurantName: formData.restaurantName || (formData.role === 'HOTEL_MANAGER' ? formData.name + ' Kitchen' : null),
        createdAt: new Date().toISOString()
      };

      setRegisteredUsers(prev => [...prev.filter(u => u.email !== newUser.email), newUser]);
      login(newUser);
      return newUser;
    } catch (error) {
      const fallbackUser = { 
        id: Date.now(), 
        ...formData, 
        role: formData.role || 'CUSTOMER',
        restaurantName: formData.restaurantName || (formData.role === 'HOTEL_MANAGER' ? formData.name + ' Kitchen' : null),
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
