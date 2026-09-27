import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-300">Verifying Admin Authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to admin login with return URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
