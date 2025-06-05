import { lazy } from 'react';

// Importaciones diferidas (lazy loading)
const LoginForm = lazy(() => import('../Views/pages/Login/LoginForm'));
const Welcome = lazy(() => import('../Views/pages/Guess/Welcome'));
const Dashboard = lazy(() => import('../Views/pages/admin/dashboard'));
const PlannerDashboard = lazy(() => import('../Views/pages/planner/dashboard'));
const Gerente = lazy(() => import('../Views/pages/gerencia/dashboard/dashboard'));
const ClienteDashboard = lazy(() => import('../Views/pages/notificacion/dashboard'));
const Tecnico = lazy(() => import('../Views/pages/tecnico_encargado/dashboard'));
const Notificaciones = lazy(() => import('../Views/pages/notificacion/notificacionesForm/NotificacionesForm'));
const NotFoundHandler = lazy(() => import('../core/Guards/NotFoundHandler'));
const DashboardOrden = lazy(() => import('../Views/pages/gerencia/OrdenesDeTrabajo/dashboardOrden'));

// Tipos para la configuración de rutas
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiresAuth: boolean;
  allowedRoles?: number[];
}

// Configuración de rutas
export const routes: RouteConfig[] = [
  // Rutas públicas
  {
    path: '/login',
    component: LoginForm,
    requiresAuth: false
  },
  
  // Rutas base (cualquier usuario autenticado)
  {
    path: '/',
    component: Welcome,
    requiresAuth: true
  },
  {
    path: '/welcome',
    component: Welcome,
    requiresAuth: true
  },
  
  // Rutas específicas para administradores
  {
    path: '/admin',
    component: Dashboard,
    requiresAuth: true,
    allowedRoles: [1]
  },
  {
    path: '/admin/dashboard',
    component: Dashboard,
    requiresAuth: true,
    allowedRoles: [1]
  },
  
  // Rutas específicas para gerentes
  {
    path: '/notificaciones',
    component: Gerente,
    requiresAuth: true,
    allowedRoles: [2]
  },
  {
    path: '/gerente/notificaciones',
    component: Gerente,
    requiresAuth: true,
    allowedRoles: [2]
  },
  
  // Rutas específicas para planificadores
  {
    path: '/planner/dashboard',
    component: PlannerDashboard,
    requiresAuth: true,
    allowedRoles: [3]
  },
  
  // Rutas específicas para técnicos
  {
    path: '/tecnico/dashboard',
    component: Tecnico,
    requiresAuth: true,
    allowedRoles: [4]
  },
  
  // Rutas específicas para clientes
  {
    path: '/cliente/dashboard',
    component: ClienteDashboard,
    requiresAuth: false,
    
  },
  {
    path: '/notificacion',
    component: Notificaciones,
    requiresAuth: false
    
  },
  {
    path: '/ordenes',
    component: DashboardOrden,
    requiresAuth: false,
  },
  
  // Ruta 404 (fallback)
  {
    path: '*',
    component: NotFoundHandler,
    requiresAuth: false
  }
];