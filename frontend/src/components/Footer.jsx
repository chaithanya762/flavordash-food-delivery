import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-brand">
          <div className="nav-brand">
            <span className="nav-logo-icon">🍔</span>
            <span className="nav-logo-text">FlavorDash</span>
          </div>
          <p className="footer-tagline">
            Delivering authentic Indian & Global culinary happiness straight to your doorstep in 30 minutes guaranteed.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Navigation</h3>
          <div className="footer-links">
            <Link to="/" className="footer-link">🏠 Home</Link>
            <Link to="/menu" className="footer-link">🍽️ Menu & AI Filters</Link>
            <Link to="/orders" className="footer-link">📋 Live Order Tracker</Link>
            <Link to="/kitchen" className="footer-link">👨‍🍳 Kitchen Portal</Link>
            <Link to="/driver" className="footer-link">🛵 Rider GPS App</Link>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact & Support</h3>
          <div className="footer-contact">
            <p><span>📍</span> Connaught Place, New Delhi, India</p>
            <p><span>📞</span> +91 98765 43210</p>
            <p><span>✉️</span> support@flavordash.in</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        {/* Prominent Made with Love Badge */}
        <div className="made-with-love-pill">
          <span>Made with</span>
          <span className="heart-pulsing">❤️</span>
          <span>by</span>
          <span className="author-name-gradient">Chaithanya</span>
        </div>

        <p className="copyright-text">© 2026 FlavorDash Inc. All rights reserved.</p>
        
        <div className="social-links">
          <span className="social-icon" title="Mobile App">📱</span>
          <span className="social-icon" title="Chat Support">💬</span>
          <span className="social-icon" title="Email Support">📧</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
