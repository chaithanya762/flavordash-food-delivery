import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="nav-brand">
            <span className="nav-logo-icon">🍔</span>
            <span className="nav-logo-text">FlavorDash</span>
          </div>
          <p className="footer-tagline">
            Delivering happiness to your doorstep. Experience the best food from top restaurants around you.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/menu" className="footer-link">Menu</Link>
            <Link to="/orders" className="footer-link">Orders</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <div className="footer-contact">
            <p><span>📍</span> 123 Flavor Street, Food City</p>
            <p><span>📞</span> +1 (555) 123-4567</p>
            <p><span>✉️</span> support@flavordash.com</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 FlavorDash. All rights reserved.</p>
        <div className="social-links">
          <span className="social-icon">📱</span>
          <span className="social-icon">💬</span>
          <span className="social-icon">📧</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
