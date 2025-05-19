import { useEffect, useState } from 'react'
import Navbar from './shared/components/NavBar/NavBar'
import './App.css'
import LoginForm from './Views/pages/Login/LoginForm'
import Welcome from './Views/pages/Guess/Welcome'
import Dashboard from './Views/pages/admin/dashboard'
import PlannerDashboard from './Views/pages/planner/dashboard'
import GerenteDashboard from './Views/pages/gerencia mtto/dashboard'
import ClienteDashboard from './Views/pages/cliente/dashboard'
import Tecnico from './Views/pages/tecnico_encargado/dashboard'
import Notificaciones from './Views/pages/cliente/Notificaciones/Notificaciones'
import { ProtectedRoute } from './core/Guards/ProtectedRoute'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import authService from './core/services/auth.service'
import NotFoundHandler from './core/Guards/NotFoundHandler'

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

const LoginRedirect = () => {
  // Verificar si el usuario ya está autenticado
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    // Si ya está autenticado, redirigir a su dashboard según su rol
    const redirectUrl = authService.getRedirectUrl();
    return <Navigate to={redirectUrl} replace />;
  } else {
    // Si no está autenticado, mostrar el formulario de login
    return <LoginForm />;
  }
};

function App() {

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
        
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginRedirect />}/>
          
          {/* Ruta de redirección */}
          
          {/* Rutas protegidas para todos los usuarios autenticados */}
          <Route element={<ProtectedRoute />}>
            {/* Ruta de bienvenida general */}
            <Route path="/" element={<Welcome/>} />
            <Route path="/welcome" element={<Welcome/>} />
            
            {/* Rutas específicas para administradores */}
            <Route element={<ProtectedRoute allowedRoles={['1']} />}>
              <Route path="/admin" element={<Dashboard/>} />
              <Route path="/admin/dashboard" element={<Dashboard/>} />
            </Route>
            
            {/* Rutas específicas para gerentes */}
            <Route element={<ProtectedRoute allowedRoles={['2']} />}>
              <Route path="/gerente/dashboard" element={<GerenteDashboard/>} />
            </Route>
            
            {/* Rutas específicas para planificadores */}
            <Route element={<ProtectedRoute allowedRoles={['3']} />}>
              <Route path="/planner/dashboard" element={<PlannerDashboard/>} />
            </Route>
            
            {/* Rutas específicas para técnicos */}
            <Route element={<ProtectedRoute allowedRoles={['4']} />}>
              <Route path="/tecnico/dashboard" element={<Tecnico/>} />
            </Route>
            
            {/* Rutas específicas para clientes */}
            <Route element={<ProtectedRoute allowedRoles={['5']} />}>
              <Route path="/cliente/dashboard" element={<ClienteDashboard/>} />
              <Route path="/tickets" element={<Notificaciones/>} />
            </Route>
          </Route>
          
          {/* Ruta de fallback para manejar rutas no encontradas */}
           <Route path="*" element={<NotFoundHandler />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App


