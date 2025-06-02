import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './shared/components/NavBar/NavBar'
import { ProtectedRoute } from './core/Guards/ProtectedRoute'
import authService from './core/services/Auth/auth.service'
import { routes } from './routes/routeConfig'
import { usePrefetchRoutes } from './routes/AppRoutes'
import './App.css'

// Componente que renderiza la Navbar solo si no estamos en la ruta de login
const NavbarWrapper = () => {
  const location = useLocation();
  // No mostrar la navbar en la ruta de login
  if (location.pathname === '/login') {
    return null;
  }
  
  // Mostrar la navbar en todas las demás rutas
  return <Navbar />;
};

// Componente para la redirección en login
const LoginRedirect = () => {
  // Verificar si el usuario ya está autenticado
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    // Si ya está autenticado, redirigir a su dashboard según su rol
    const redirectUrl = authService.getRedirectUrl();
    return <Navigate to={redirectUrl} replace />;
  } else {
    // Si no está autenticado, mostrar el formulario de login
    const LoginForm = lazy(() => import('./Views/pages/Login/LoginForm'));
    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <LoginForm />
      </Suspense>
    );
  }
};

function App() {
  
  usePrefetchRoutes();
  
  
  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      if (!authService.isAuthenticated()) {
          window.location.href = '/login';
      }
    }, 5 * 60 * 1000); 
    
    return () => clearInterval(checkTokenInterval);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar condicional */}
        <Routes>
          <Route path="*" element={<NavbarWrapper />} />
        </Routes>
        
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {/* Ruta de login (especial) */}
            <Route path="/login" element={<LoginRedirect />} />
            
            {/* Mapeamos todas las demás rutas desde la configuración */}
            {routes.map(route => {
              // Saltamos la ruta de login porque ya la manejamos arriba
              if (route.path === '/login') return null;
              
              // Para rutas protegidas
              if (route.requiresAuth) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <ProtectedRoute allowedRoles={route.allowedRoles}>
                        <Suspense>
                          <route.component />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                );
              }
              
              // Para rutas públicas (no incluye login, que ya está manejado)
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <route.component />
                    </Suspense>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;