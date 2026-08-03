import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <a href="/" className="footer-link" onClick={(e) => handleNavClick(e, '/')}>🏠 Home</a>
            <a href="/menu" className="footer-link" onClick={(e) => handleNavClick(e, '/menu')}>🍽️ Menu & AI Filters</a>
            <a href="/cart" className="footer-link" onClick={(e) => handleNavClick(e, '/cart')}>🛒 Cart</a>
            <a href="/orders" className="footer-link" onClick={(e) => handleNavClick(e, '/orders')}>📋 Live Order Tracker</a>
            <a href="/kitchen" className="footer-link" onClick={(e) => handleNavClick(e, '/kitchen')}>👨‍🍳 Kitchen Portal</a>
            <a href="/driver" className="footer-link" onClick={(e) => handleNavClick(e, '/driver')}>🛵 Rider GPS App</a>
            <a href="/login" className="footer-link" onClick={(e) => handleNavClick(e, '/login')}>🔑 Login / Register</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact & Support</h3>
          <div className="footer-contact">
            <p><span>📍</span> JP Nagar, Mahadevapura, Mysore</p>
            <p>
              <span>📞</span>
              <a href="tel:+919591791336" className="footer-contact-link">+91 95917 91336</a>
            </p>
            <p>
              <span>✉️</span>
              <a href="mailto:chaithanyagowda762@gmail.com" className="footer-contact-link">chaithanyagowda762@gmail.com</a>
            </p>
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
          <a href="tel:+919591791336" className="social-icon" title="Call Us">📱</a>
          <a href="mailto:chaithanyagowda762@gmail.com" className="social-icon" title="Email Us">📧</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
