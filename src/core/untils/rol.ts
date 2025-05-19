export const getDashboardByRole = (role: string): string => {
  switch (role) {
    case '1':
      return '/admin/dashboard';
    case '2':
      return '/gerente/dashboard';
    case '3':
      return '/planner/dashboard';
    case '4':
      return '/tecnico/dashboard';
    case '5':
      return '/cliente/dashboard';
    default:
      return '/welcome'; 
  }
};