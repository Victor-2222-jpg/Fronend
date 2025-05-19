import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import authService from '../services/auth.service';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const location = useLocation();

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles permitidos si existen
  if (allowedRoles && allowedRoles.length > 0) {
    let hasRequiredRole = false;
    
    // Manejo para cuando userRole es un array
    if (Array.isArray(userRole)) {
      hasRequiredRole = userRole.some(role => allowedRoles.includes(role));
    } 
    // Manejo para cuando userRole es un string
    else if (userRole) {
      hasRequiredRole = allowedRoles.includes(userRole);
    }

    if (!hasRequiredRole) {
      const redirectUrl = authService.getRedirectUrl();
      return <Navigate to={redirectUrl} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;