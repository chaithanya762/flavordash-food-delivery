import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderAPI } from '../api/api';

const OrderContext = createContext();

export const INITIAL_ORDERS = [
  {
    id: 1001,
    userId: 1,
    customerName: 'Alex Johnson',
    customerPhone: '+91 98765 43210',
    deliveryAddress: '742 Evergreen Terrace, Sector 4, New Delhi',
    restaurantName: 'Punjab Rasoi',
    items: [
      { name: 'Royal Butter Chicken', quantity: 2, price: 389 },
      { name: 'Garlic Butter Naan', quantity: 4, price: 79 }
    ],
    totalAmount: 1143,
    status: 'RECEIVED',
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 1002,
    userId: 2,
    customerName: 'Priya Sharma',
    customerPhone: '+91 91234 56789',
    deliveryAddress: 'Connaught Place, Block B, New Delhi',
    restaurantName: 'Paradise Biryani',
    items: [
      { name: 'Hyderabadi Chicken Dum Biryani', quantity: 1, price: 349 },
      { name: 'Punjabi Sweet Malai Lassi', quantity: 2, price: 129 }
    ],
    totalAmount: 655,
    status: 'COOKING',
    paymentMethod: 'CARD',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 1003,
    userId: 1,
    customerName: 'Alex Johnson',
    customerPhone: '+91 98765 43210',
    deliveryAddress: '742 Evergreen Terrace, Sector 4, New Delhi',
    restaurantName: 'MTR 1924',
    items: [
      { name: 'Mysore Crispy Masala Dosa', quantity: 2, price: 199 },
      { name: 'South Indian Filter Coffee', quantity: 2, price: 89 }
    ],
    totalAmount: 624,
    status: 'DISPATCHED',
    riderName: 'Ramesh Kumar (Rider Express)',
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString()
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('global_orders_db');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('global_orders_db', JSON.stringify(orders));
  }, [orders]);

  // Create order placed by Customer
  const createOrder = async (orderData) => {
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      userId: orderData.userId || 1,
      customerName: orderData.customerName || 'Alex Johnson',
      customerPhone: orderData.customerPhone || '+91 98765 43210',
      deliveryAddress: orderData.deliveryAddress || '742 Evergreen Terrace, Sector 4, New Delhi',
      restaurantName: orderData.restaurantName || 'Punjab Rasoi',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 500,
      status: 'RECEIVED',
      paymentMethod: orderData.paymentMethod || 'UPI',
      createdAt: new Date().toISOString()
    };

    try {
      await orderAPI.create({
        userId: newOrder.userId,
        productIds: orderData.productIds || [],
        deliveryAddress: newOrder.deliveryAddress,
        totalAmount: newOrder.totalAmount
      });
    } catch (err) {
      console.warn('Backend API order sync error, using local database bridge');
    }

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Update order status across Kitchen (Hotel Manager) & Rider Agent
  const updateOrderStatus = (orderId, newStatus, riderInfo = null) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId || String(order.id) === String(orderId)) {
        return { 
          ...order, 
          status: newStatus,
          ...(riderInfo ? { riderName: riderInfo } : {})
        };
      }
      return order;
    }));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
