import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  rol: string | string[];
  exp: number;
  // Otros campos que pueda tener tu token
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

  getUserRole(): string | string[] | null {
    const decodedToken = this.decodeToken();
    console.log('Decoded token:', decodedToken);
    return decodedToken ? decodedToken.rol : null;
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
    return userRole === requiredRole;
  }

  

}

export default new TokenService();