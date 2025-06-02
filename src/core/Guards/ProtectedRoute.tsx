import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/Auth/auth.service';
import type { ProtectedRouteProps } from '../Models/Routes/ProtectedRoutes.interface';



export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children,allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const location = useLocation();

  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles permitidos si existen
  if (allowedRoles && allowedRoles.length > 0) {
    let hasRequiredRole = false;
    
    // Manejo para cuando userRole es un array
    if (Array.isArray(userRole)) {
      console.log('userRole es un array:', userRole);
      console.log('allowedRoles:', allowedRoles);
      hasRequiredRole = userRole.some(role => allowedRoles.includes(Number(role)));
      console.log('hasRequiredRole bbbbb:', hasRequiredRole);
    } 
    // Manejo para cuando userRole es un string
    else if (userRole) {
      
      hasRequiredRole = allowedRoles.includes(Number(userRole));
     
    }

    if (!hasRequiredRole) {
      const redirectUrl = authService.getRedirectUrl();
      return <Navigate to={redirectUrl} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;