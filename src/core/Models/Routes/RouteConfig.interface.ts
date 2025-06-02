export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiresAuth: boolean;
  allowedRoles?: number[];
}