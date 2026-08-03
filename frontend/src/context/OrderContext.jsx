import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderAPI } from '../api/api';

const OrderContext = createContext();

export const INITIAL_ORDERS = [];

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
      userId: orderData.userId || Date.now(),
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
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

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem('global_orders_db');
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      clearOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
