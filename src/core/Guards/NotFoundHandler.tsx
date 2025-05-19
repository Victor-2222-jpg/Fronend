import { Navigate } from "react-router-dom";
import authService from "../services/auth.service";

 export const NotFoundHandler = () => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    // Si está autenticado, redirigir a su dashboard según su rol
    const redirectUrl = authService.getRedirectUrl();
    return <Navigate to={redirectUrl} replace />;
  } else {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }
};
export default NotFoundHandler;