import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUser = await userAPI.create(formData);
      // Auto login after registration
      login(newUser);
      navigate('/');
    } catch (err) {
      setError('Registration failed. The API might not be running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="floating-elements">
        <span className="float emoji-1">🥗</span>
        <span className="float emoji-2">🍰</span>
        <span className="float emoji-3">🥡</span>
      </div>

      <div className="auth-card register-card glass fade-in">
        <div className="auth-header">
          <h1 className="gradient-text">Create Account</h1>
          <p>Join FlavorDash today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe"
              className="glass-input"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john@example.com"
              className="glass-input"
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 (555) 000-0000"
              className="glass-input"
              required 
            />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              placeholder="123 Main St, Apt 4B"
              className="glass-input"
              rows="2"
              required 
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}
