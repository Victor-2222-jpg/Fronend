export const getDashboardByRole = (role: number): string => {
  switch (role) {
    case 1:
      return '/admin/dashboard';
    case 2:
      return '/notificaciones';
    case 3:
      return '/planner/dashboard';
    case 4:
      return '/tecnico/dashboard';
    case 5:
      return '/cliente/dashboard';
    default:
      return '/welcome'; 
  }
};