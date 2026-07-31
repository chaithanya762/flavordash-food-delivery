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
          <Link to="/" className="nav-brand">
            <span className="nav-logo-icon">🍔</span>
            <span className="nav-logo-text">FlavorDash</span>
            <span className={`role-badge-tag ${userRole.toLowerCase()}`}>
              {userRole === 'CUSTOMER' && 'CUSTOMER'}
              {userRole === 'HOTEL_MANAGER' && 'HOTEL ADMIN'}
              {userRole === 'RIDER' && 'RIDER AGENT'}
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>

            {/* Strictly Logged-In Role Links */}
            {userRole === 'CUSTOMER' && (
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
            )}

            {userRole === 'HOTEL_MANAGER' && (
              <Link to="/kitchen" className={`nav-link ${location.pathname === '/kitchen' ? 'active' : ''}`}>👨‍🍳 Kitchen Desk</Link>
            )}

            {userRole === 'RIDER' && (
              <Link to="/driver" className={`nav-link ${location.pathname === '/driver' ? 'active' : ''}`}>🛵 Rider GPS</Link>
            )}

            <button className="nav-link backend-diag-link" onClick={() => setBackendModalOpen(true)}>
              ⚙️ Backend Status
            </button>
          </div>

          <div className="nav-actions">
            {/* Shopping Cart (Customers Only) */}
            {userRole === 'CUSTOMER' && (
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
                  <span className="user-avatar">👤</span>
                  <div className="user-info-pill">
                    <span className="user-name">{user.name || 'User'}</span>
                    <span className="user-role-sub">({userRole})</span>
                  </div>
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
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>🏠 Home</Link>
          <Link to="/menu" className="mobile-link" onClick={toggleMobileMenu}>🍽️ Menu</Link>

          {userRole === 'CUSTOMER' && (
            <>
              <Link to="/cart" className="mobile-link" onClick={toggleMobileMenu}>🛒 Cart ({count})</Link>
              <Link to="/orders" className="mobile-link" onClick={toggleMobileMenu}>📋 My Orders</Link>
            </>
          )}

          {userRole === 'HOTEL_MANAGER' && (
            <Link to="/kitchen" className="mobile-link" onClick={toggleMobileMenu}>👨‍🍳 Kitchen Desk</Link>
          )}

          {userRole === 'RIDER' && (
            <Link to="/driver" className="mobile-link" onClick={toggleMobileMenu}>🛵 Rider GPS App</Link>
          )}

          <button className="mobile-link text-left" onClick={() => { setBackendModalOpen(true); toggleMobileMenu(); }}>⚙️ Backend Status</button>

          <div className="mobile-divider"></div>

          {user ? (
            <div className="mobile-user-section">
              <p className="user-greeting">Signed in as <strong>{user.name}</strong> ({userRole})</p>
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
