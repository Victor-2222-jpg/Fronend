import { useEffect, useState } from "react";
import authService from "../../../core/services/Auth/auth.service";

function useNavBar() {
  const [userRole, setUserRole] = useState<number | number[] | null>(null);

  useEffect(() => {
    const getUserRole = () => {
      // Obtener el rol directamente del servicio de autenticación
      const role = authService.getUserRole();
      
      if (role) {
        console.log('Rol obtenido del token:', role);
        
        // Si es un array, tomamos el primer rol (o todos si es necesario)
        if (Array.isArray(role)) {
          setUserRole(role.map(r => parseInt(r, 10)));
        } else {
          // Si es un número o string, lo convertimos a número
          setUserRole(typeof role === 'string' ? parseInt(role, 10) : role);
        }
      } else {
        console.log('No se pudo obtener el rol del usuario');
        setUserRole(null);
      }
    };

    getUserRole();
  }, []);
  
  // Función helper para verificar si el usuario tiene cierto rol
  const hasRole = (roleToCheck: number | number[]): boolean => {
    if (userRole === null) return false;
    
    const rolesToCheck = Array.isArray(roleToCheck) ? roleToCheck : [roleToCheck];
    
    if (Array.isArray(userRole)) {
      return userRole.some(role => rolesToCheck.includes(role));
    }
    
    return rolesToCheck.includes(userRole);
  };
  
  // Retornar el rol y funciones útiles
  return {
    userRole,
    hasRole
  };
}

export default useNavBar;