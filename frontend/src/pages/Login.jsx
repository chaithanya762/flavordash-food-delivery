import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('1'); // Mock specific ID for demo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, we would send credentials to /auth/login
      // For this demo with the given backend, we fetch the user by ID and set context
      const userData = await userAPI.getById(parseInt(userId));
      login(userData);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials or ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="floating-elements">
        <span className="float emoji-1">🍕</span>
        <span className="float emoji-2">🍔</span>
        <span className="float emoji-3">🍣</span>
        <span className="float emoji-4">🥤</span>
      </div>

      <div className="auth-card glass fade-in">
        <div className="auth-header">
          <h1 className="gradient-text">Welcome Back</h1>
          <p>Sign in to continue ordering delicious food</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
          
          {/* Demo only field since backend has no auth */}
          <div className="form-group demo-field">
            <label>User ID (Demo Only)</label>
            <input 
              type="number" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              className="glass-input"
              required 
            />
            <small>Leave as 1 for mock data access if API fails</small>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
