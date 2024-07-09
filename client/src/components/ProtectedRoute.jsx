import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const ProtectedRoute = ({ children, redirectTo = '/auth' }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;