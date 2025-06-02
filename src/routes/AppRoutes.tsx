import { useEffect } from 'react';
import authService from '../core/services/Auth/auth.service';

export const usePrefetchRoutes = () => {
  useEffect(() => {
    // Función para prefetchear rutas según el rol del usuario
    const prefetchRoutes = async () => {
      // Solo hacer prefetch si el usuario está autenticado
      if (!authService.isAuthenticated()) return;
      
      const role = authService.getUserRole();
      
      // Prefetchear Welcome para todos los usuarios autenticados
      import('../Views/pages/Guess/Welcome');
      import('../Views/pages/notificacion/notificacionesForm/NotificacionesForm');
      
      
      // Prefetchear rutas basadas en rol
      switch (Number(role)) {
        case 1: // Admin
          import('../Views/pages/admin/dashboard');
          break;
        case 2: // Gerente
          import('../Views/pages/gerencia/dashboard/dashboard');
          break;
        case 3: // Planner
          import('../Views/pages/planner/dashboard');
          break;
        case 4: // Técnico
          import('../Views/pages/tecnico_encargado/dashboard');
          break;
        case 5: // Cliente
          import('../Views/pages/notificacion/dashboard');
          import('../Views/pages/notificacion/notificacionesForm/NotificacionesForm');
          break;
      }
    };
    
    // Ejecutar después de un pequeño retraso para no bloquear la carga inicial
    const timer = setTimeout(prefetchRoutes, 2000);
    
    return () => clearTimeout(timer);
  }, []);
};