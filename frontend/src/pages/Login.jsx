import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [userId, setUserId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (demoRole, demoName, demoEmail) => {
    const demoUser = {
      id: Date.now(),
      name: demoName,
      email: demoEmail,
      role: demoRole
    };
    login(demoUser);

    if (demoRole === 'HOTEL_MANAGER') {
      navigate('/kitchen');
    } else if (demoRole === 'RIDER') {
      navigate('/driver');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData;
      try {
        userData = await userAPI.getById(parseInt(userId));
      } catch (err) {
        userData = { id: parseInt(userId), name: email.split('@')[0] || 'User', email };
      }
      
      const loggedUser = { ...userData, role };
      login(loggedUser);

      if (role === 'HOTEL_MANAGER') {
        navigate('/kitchen');
      } else if (role === 'RIDER') {
        navigate('/driver');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="floating-elements">
        <span className="float emoji-1">🍕</span>
        <span className="float emoji-2">👨‍🍳</span>
        <span className="float emoji-3">🛵</span>
        <span className="float emoji-4">🥤</span>
      </div>

      <div className="auth-card glass fade-in">
        <div className="auth-header">
          <h1 className="gradient-text">Welcome Back</h1>
          <p>Sign in with your role-based account</p>
        </div>

        {/* 1-Click Quick Demo Role Sign In */}
        <div className="quick-demo-login-box">
          <span className="quick-demo-label">⚡ 1-Click Instant Demo Login:</span>
          <div className="quick-demo-btns">
            <button 
              type="button" 
              className="btn-quick-role customer"
              onClick={() => handleQuickLogin('CUSTOMER', 'Alex Johnson', 'alex@example.com')}
            >
              👤 Customer
            </button>
            <button 
              type="button" 
              className="btn-quick-role hotel"
              onClick={() => handleQuickLogin('HOTEL_MANAGER', 'Chef Rajat (Punjab Rasoi)', 'chef@rasoi.in')}
            >
              👨‍🍳 Hotel Admin
            </button>
            <button 
              type="button" 
              className="btn-quick-role rider"
              onClick={() => handleQuickLogin('RIDER', 'Ramesh Kumar (Rider)', 'ramesh@rider.in')}
            >
              🛵 Rider Agent
            </button>
          </div>
        </div>

        <div className="auth-divider"><span>OR SIGN IN MANUALLY</span></div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Select Account Type / Role</label>
            <div className="role-radio-selector">
              <label className={`role-radio-tile ${role === 'CUSTOMER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="CUSTOMER" 
                  checked={role === 'CUSTOMER'} 
                  onChange={(e) => setRole(e.target.value)} 
                />
                <span>👤 Customer</span>
              </label>

              <label className={`role-radio-tile ${role === 'HOTEL_MANAGER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="HOTEL_MANAGER" 
                  checked={role === 'HOTEL_MANAGER'} 
                  onChange={(e) => setRole(e.target.value)} 
                />
                <span>👨‍🍳 Hotel</span>
              </label>

              <label className={`role-radio-tile ${role === 'RIDER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="RIDER" 
                  checked={role === 'RIDER'} 
                  onChange={(e) => setRole(e.target.value)} 
                />
                <span>🛵 Rider</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
              className="glass-input"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : `Sign In as ${role}`}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
