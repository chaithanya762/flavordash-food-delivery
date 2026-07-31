import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, role, switchRole } = useAuth();

  const currentRole = user?.role || role || 'CUSTOMER';

  if (!allowedRoles.includes(currentRole)) {
    const targetRole = allowedRoles[0];
    const isHotel = targetRole === 'HOTEL_MANAGER';

    return (
      <div className="role-access-page container fade-in">
        <div className="role-access-card glass-card">
          <span className="role-access-icon">{isHotel ? '👨‍🍳' : '🛵'}</span>
          <h2 className="gradient-text">
            {isHotel ? 'Hotel Kitchen Desk Access' : 'Delivery Rider Portal Access'}
          </h2>
          <p className="role-access-desc">
            You are currently signed in as <strong>{currentRole}</strong>. Click the button below to switch your role to <strong>{targetRole}</strong> and unlock this portal instantly!
          </p>
          <button 
            className="btn btn-primary btn-grant-role"
            onClick={() => switchRole(targetRole)}
          >
            ⚡ Unlock {isHotel ? 'Hotel Admin' : 'Rider Agent'} Portal Now
          </button>
        </div>
      </div>
    );
  }

  return children;
}
