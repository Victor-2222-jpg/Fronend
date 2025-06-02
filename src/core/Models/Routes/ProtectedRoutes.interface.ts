export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}