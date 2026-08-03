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
      refundStatus: null,
      refundAmount: 0,
      cancellationReason: null,
      cancelledBy: null,
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

  // Cancel Order Function with Reason & Refund Calculation
  const cancelOrder = (orderId, cancelledByRole, reason) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId || String(order.id) === String(orderId)) {
        let refundStatus = 'NOT_ELIGIBLE';
        let refundAmount = 0;

        // Refund Rules:
        // 1. Hotel Manager cancels -> 100% Full Refund always
        // 2. Rider cancels -> 100% Full Refund (or re-route)
        // 3. Customer cancels at RECEIVED stage -> 100% Full Refund
        // 4. Customer cancels at COOKING stage -> 50% Partial Refund
        if (cancelledByRole === 'HOTEL_MANAGER' || cancelledByRole === 'RIDER') {
          refundStatus = 'FULL_REFUND_PROCESSED';
          refundAmount = order.totalAmount;
        } else if (cancelledByRole === 'CUSTOMER') {
          if (order.status === 'RECEIVED') {
            refundStatus = 'FULL_REFUND_PROCESSED';
            refundAmount = order.totalAmount;
          } else if (order.status === 'COOKING') {
            refundStatus = 'PARTIAL_REFUND_PROCESSED';
            refundAmount = Math.round(order.totalAmount * 0.5);
          } else {
            refundStatus = 'NOT_ELIGIBLE';
            refundAmount = 0;
          }
        }

        return {
          ...order,
          status: 'CANCELLED',
          cancelledBy: cancelledByRole,
          cancellationReason: reason || 'No reason provided',
          refundStatus,
          refundAmount
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
      cancelOrder,
      clearOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
