import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, role } = useAuth();
  const { showToast } = useToast() || { showToast: () => {} };

  const currentRole = user?.role || role || 'CUSTOMER';

  if (!allowedRoles.includes(currentRole)) {
    showToast(`Access Denied! ${allowedRoles.join(' or ')} role required.`, 'error');
    return <Navigate to="/" replace />;
  }

  return children;
}
