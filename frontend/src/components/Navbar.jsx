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
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role || 'CUSTOMER';
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
          {/* LEFT: BRAND LOGO */}
          <Link to="/" className="nav-brand">
            <span className="nav-logo-icon">🍔</span>
            <span className="nav-logo-text">FlavorDash</span>
            {user && (
              <span className={`role-badge-tag ${userRole.toLowerCase()}`}>
                {userRole === 'CUSTOMER' && 'CUSTOMER'}
                {userRole === 'HOTEL_MANAGER' && 'HOTEL ADMIN'}
                {userRole === 'RIDER' && 'RIDER AGENT'}
              </span>
            )}
          </Link>

          {/* CENTER: LOCATION & DELIVERY STATUS INDICATOR */}
          <div className="nav-location-pill">
            <span className="loc-pin">📍</span>
            <span className="loc-text">New Delhi, Sector 4</span>
            <span className="loc-dot">•</span>
            <span className="delivery-eta">⚡ 25 min</span>
          </div>

          {/* RIGHT: NAVIGATION & ACTIONS */}
          <div className="nav-actions">
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>

              {userRole === 'CUSTOMER' && user && (
                <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
              )}

              {userRole === 'HOTEL_MANAGER' && (
                <Link to="/kitchen" className={`nav-link ${location.pathname === '/kitchen' ? 'active' : ''}`}>👨‍🍳 Kitchen Desk</Link>
              )}

              {userRole === 'RIDER' && (
                <Link to="/driver" className={`nav-link ${location.pathname === '/driver' ? 'active' : ''}`}>🛵 Rider GPS</Link>
              )}

              <button className="nav-link backend-diag-link" onClick={() => setBackendModalOpen(true)}>
                ⚙️ Status
              </button>
            </div>

            {/* Shopping Cart */}
            {(!user || userRole === 'CUSTOMER') && (
              <button 
                className={`cart-btn-nav ${bump ? 'bump' : ''}`}
                onClick={() => navigate('/cart')}
                title="View Shopping Cart"
              >
                <span className="cart-nav-icon">🛒</span>
                <span className="cart-nav-label">Order</span>
                {count > 0 && <span className="cart-badge-count">{count}</span>}
              </button>
            )}

            {/* AUTH BUTTONS / USER PROFILE */}
            <div className="auth-buttons">
              {user ? (
                <div className="user-profile">
                  <div className="user-avatar-pill">
                    <span className="avatar-initial">{user.name?.charAt(0) || 'U'}</span>
                    <span className="user-name">{user.name?.split(' ')[0] || 'User'}</span>
                  </div>
                  <button onClick={logout} className="btn-logout" title="Sign Out">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="auth-nav-group">
                  <Link to="/login" className="nav-btn-login">Sign In</Link>
                  <Link to="/register" className="nav-btn-register">Register</Link>
                </div>
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
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>🏠 Home</Link>
          <Link to="/menu" className="mobile-link" onClick={toggleMobileMenu}>🍽️ Menu</Link>

          {(!user || userRole === 'CUSTOMER') && (
            <>
              <Link to="/cart" className="mobile-link" onClick={toggleMobileMenu}>🛒 Cart ({count})</Link>
              {user && <Link to="/orders" className="mobile-link" onClick={toggleMobileMenu}>📋 My Orders</Link>}
            </>
          )}

          {userRole === 'HOTEL_MANAGER' && (
            <Link to="/kitchen" className="mobile-link" onClick={toggleMobileMenu}>👨‍🍳 Kitchen Desk</Link>
          )}

          {userRole === 'RIDER' && (
            <Link to="/driver" className="mobile-link" onClick={toggleMobileMenu}>🛵 Rider GPS App</Link>
          )}

          <div className="mobile-divider"></div>

          {user ? (
            <div className="mobile-user-section">
              <p className="user-greeting">Signed in as <strong>{user.name}</strong> ({userRole})</p>
              <button onClick={() => { logout(); toggleMobileMenu(); }} className="btn btn-secondary w-full">Sign Out</button>
            </div>
          ) : (
            <div className="mobile-auth-btns">
              <Link to="/login" className="nav-btn-login w-full text-center" onClick={toggleMobileMenu}>Sign In</Link>
              <Link to="/register" className="nav-btn-register w-full text-center" onClick={toggleMobileMenu}>Register</Link>
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
