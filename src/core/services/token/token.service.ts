import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id ?: string;
  sub: string;
  email: string;
  nombre: string;
  Apellido_Paterno: string;
  Apellido_Materno: string;
  rol: number | number[];
  exp: number;
  
}

class TokenService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getUsername(): string | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken) return null;
    const { nombre, Apellido_Paterno, Apellido_Materno } = decodedToken;
    if (!nombre && !Apellido_Paterno && !Apellido_Materno) return null;
    return [nombre, Apellido_Paterno, Apellido_Materno].filter(Boolean).join(' ');
  }

  getuserTipos(): string | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken) return null;

    const { rol } = decodedToken;

    // Puedes personalizar los nombres según tus roles
    const roleMap: Record<number, string> = {
      1: 'Administrador',
      2: 'Gerente',
      3: 'Coordinador',
      4: 'Técnico',
      5: 'Usuario',
      // Agrega más roles según sea necesario
    };

    if (Array.isArray(rol)) {
      // Si hay varios roles, retorna el primero mapeado (o todos concatenados si prefieres)
      return roleMap[rol[0]] || 'Desconocido';
    }

    return roleMap[rol] || 'Desconocido';
  }

  getUserRole(): number | string[] | null {
    const decodedToken = this.decodeToken();
    console.log('Decoded token:', decodedToken);
    console.log(decodedToken?.rol);
    if (!decodedToken) return null;
    if (Array.isArray(decodedToken.rol)) {
      // Convert number[] to string[]
      return decodedToken.rol.map(String);
    }
    return decodedToken.rol;
  }

  isTokenValid(): boolean {
    const decodedToken = this.decodeToken();
    if (!decodedToken) return false;
    
    // Convertir a milisegundos y comparar con la fecha actual
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() < expirationTime;
  }

  hasRole(requiredRole: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(userRole)) {
      return userRole.includes(requiredRole);
    }
    return String(userRole) === requiredRole;
  }

  

}

export default new TokenService();