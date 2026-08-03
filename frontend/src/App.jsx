import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCartStrip from './components/FloatingCartStrip';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundAtmosphere from './components/BackgroundAtmosphere';
import { OrderProvider } from './context/OrderContext';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import KitchenDashboard from './pages/KitchenDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <OrderProvider>
      <div className="app-container">
        {/* TACTILE GRAIN OVERLAY & ATMOSPHERE */}
        <div className="grain-overlay"></div>
        <BackgroundAtmosphere />

        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Protected Hotel Manager Route */}
            <Route 
              path="/kitchen" 
              element={
                <ProtectedRoute allowedRoles={['HOTEL_MANAGER']}>
                  <KitchenDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Rider Agent Route */}
            <Route 
              path="/driver" 
              element={
                <ProtectedRoute allowedRoles={['RIDER']}>
                  <DriverDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <FloatingCartStrip />
        <Footer />
      </div>
    </OrderProvider>
  );
}

export default App;
