import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BackendStatusModal from './BackendStatusModal';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [backendModalOpen, setBackendModalOpen] = useState(false);
  
  const { cart, totalItems } = useCart() || { cart: [], totalItems: 0 };
  const { user, role, theme, switchRole, toggleTheme, logout } = useAuth() || { 
    user: null, 
    role: 'CUSTOMER', 
    theme: 'dark', 
    switchRole: () => {}, 
    toggleTheme: () => {}, 
    logout: () => {} 
  };
  
  const navigate = useNavigate();
  const location = useLocation();

  const count = totalItems || cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (count > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container container">
          <Link to="/" className="nav-brand">
            <span className="nav-logo-icon">🍔</span>
            <span className="nav-logo-text">FlavorDash</span>
            <span className={`role-badge-tag ${role.toLowerCase()}`}>
              {role === 'CUSTOMER' && 'CUSTOMER'}
              {role === 'HOTEL_MANAGER' && 'HOTEL ADMIN'}
              {role === 'RIDER' && 'RIDER AGENT'}
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>

            {/* Role-Restricted Links */}
            {role === 'CUSTOMER' && (
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
            )}

            {role === 'HOTEL_MANAGER' && (
              <Link to="/kitchen" className={`nav-link ${location.pathname === '/kitchen' ? 'active' : ''}`}>👨‍🍳 Kitchen Desk</Link>
            )}

            {role === 'RIDER' && (
              <Link to="/driver" className={`nav-link ${location.pathname === '/driver' ? 'active' : ''}`}>🛵 Rider GPS</Link>
            )}

            <button className="nav-link backend-diag-link" onClick={() => setBackendModalOpen(true)}>
              ⚙️ Backend Status
            </button>
          </div>

          <div className="nav-actions">
            {/* Role Switcher Pill */}
            <div className="role-switcher-group">
              <button 
                className={`role-btn ${role === 'CUSTOMER' ? 'active' : ''}`}
                onClick={() => switchRole('CUSTOMER')}
                title="Switch to Customer Mode"
              >
                👤 Customer
              </button>
              <button 
                className={`role-btn hotel ${role === 'HOTEL_MANAGER' ? 'active' : ''}`}
                onClick={() => switchRole('HOTEL_MANAGER')}
                title="Switch to Hotel Kitchen Mode"
              >
                👨‍🍳 Hotel
              </button>
              <button 
                className={`role-btn rider ${role === 'RIDER' ? 'active' : ''}`}
                onClick={() => switchRole('RIDER')}
                title="Switch to Rider Agent Mode"
              >
                🛵 Rider
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Cart Button (For Customers) */}
            {role === 'CUSTOMER' && (
              <button 
                className={`cart-btn-nav ${bump ? 'bump' : ''}`}
                onClick={() => navigate('/cart')}
                title="View Shopping Cart"
              >
                <span className="cart-nav-icon">🛒</span>
                <span className="cart-nav-label">Cart</span>
                {count > 0 && <span className="cart-badge-count">{count}</span>}
              </button>
            )}

            <div className="auth-buttons">
              {user ? (
                <div className="user-profile">
                  <span className="user-name">{user.name || 'User'}</span>
                  <button onClick={logout} className="btn-logout">Logout</button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </>
              )}
            </div>

            <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="nav-brand"><span className="nav-logo-icon">🍔</span> FlavorDash</span>
          <button className="close-menu-btn" onClick={toggleMobileMenu}>✕</button>
        </div>

        <div className="mobile-nav-links">
          <div className="mobile-role-selector">
            <span className="mobile-role-title">Select Mode:</span>
            <div className="mobile-role-btns">
              <button className={role === 'CUSTOMER' ? 'active' : ''} onClick={() => switchRole('CUSTOMER')}>👤 Customer</button>
              <button className={role === 'HOTEL_MANAGER' ? 'active' : ''} onClick={() => switchRole('HOTEL_MANAGER')}>👨‍🍳 Hotel</button>
              <button className={role === 'RIDER' ? 'active' : ''} onClick={() => switchRole('RIDER')}>🛵 Rider</button>
            </div>
          </div>

          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>🏠 Home</Link>
          <Link to="/menu" className="mobile-link" onClick={toggleMobileMenu}>🍽️ Menu</Link>

          {role === 'CUSTOMER' && (
            <>
              <Link to="/cart" className="mobile-link" onClick={toggleMobileMenu}>🛒 Cart ({count})</Link>
              <Link to="/orders" className="mobile-link" onClick={toggleMobileMenu}>📋 My Orders</Link>
            </>
          )}

          {role === 'HOTEL_MANAGER' && (
            <Link to="/kitchen" className="mobile-link" onClick={toggleMobileMenu}>👨‍🍳 Kitchen Desk</Link>
          )}

          {role === 'RIDER' && (
            <Link to="/driver" className="mobile-link" onClick={toggleMobileMenu}>🛵 Rider GPS App</Link>
          )}

          <button className="mobile-link text-left" onClick={() => { setBackendModalOpen(true); toggleMobileMenu(); }}>⚙️ Backend Status</button>

          <div className="mobile-divider"></div>

          {user ? (
            <div className="mobile-user-section">
              <p className="user-greeting">Signed in as <strong>{user.name}</strong> ({role})</p>
              <button onClick={() => { logout(); toggleMobileMenu(); }} className="btn btn-secondary w-full">Logout</button>
            </div>
          ) : (
            <div className="mobile-auth-btns">
              <Link to="/login" className="btn btn-secondary" onClick={toggleMobileMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={toggleMobileMenu}>Register</Link>
            </div>
          )}
        </div>
      </div>

      <BackendStatusModal 
        isOpen={backendModalOpen} 
        onClose={() => setBackendModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
