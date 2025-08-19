import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
