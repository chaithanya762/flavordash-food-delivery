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
    address: '',
    role: 'CUSTOMER'
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
      let newUser;
      try {
        newUser = await userAPI.create(formData);
      } catch (err) {
        newUser = { id: Date.now(), ...formData };
      }
      
      const loggedUser = { ...newUser, role: formData.role };
      login(loggedUser);

      if (formData.role === 'HOTEL_MANAGER') {
        navigate('/kitchen');
      } else if (formData.role === 'RIDER') {
        navigate('/driver');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Registration failed. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="floating-elements">
        <span className="float emoji-1">🥗</span>
        <span className="float emoji-2">👨‍🍳</span>
        <span className="float emoji-3">🛵</span>
      </div>

      <div className="auth-card register-card glass fade-in">
        <div className="auth-header">
          <h1 className="gradient-text">Create Account</h1>
          <p>Join FlavorDash as Customer, Restaurant Partner, or Rider</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Register As</label>
            <div className="role-radio-selector">
              <label className={`role-radio-tile ${formData.role === 'CUSTOMER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="CUSTOMER" 
                  checked={formData.role === 'CUSTOMER'} 
                  onChange={handleChange} 
                />
                <span>👤 Customer</span>
              </label>

              <label className={`role-radio-tile ${formData.role === 'HOTEL_MANAGER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="HOTEL_MANAGER" 
                  checked={formData.role === 'HOTEL_MANAGER'} 
                  onChange={handleChange} 
                />
                <span>👨‍🍳 Hotel</span>
              </label>

              <label className={`role-radio-tile ${formData.role === 'RIDER' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="RIDER" 
                  checked={formData.role === 'RIDER'} 
                  onChange={handleChange} 
                />
                <span>🛵 Rider</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Chaithanya"
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
              placeholder="chaithanya@example.com"
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
              placeholder="+91 98765 43210"
              className="glass-input"
              required 
            />
          </div>

          <div className="form-group">
            <label>{formData.role === 'HOTEL_MANAGER' ? 'Restaurant Address' : formData.role === 'RIDER' ? 'Hub Location' : 'Delivery Address'}</label>
            <textarea 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Connaught Place, Sector 62"
              className="glass-input"
              rows="2"
              required 
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : `Register as ${formData.role}`}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}
