import axios from 'axios';
import config from '../../config/config';
import tokenService from './token/token.service';
import { getDashboardByRole } from '../untils/rol';

const API_URL = config.API_URL + '/account/login';

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}`, {
        email,
        password
      });

      console.log('soy un token:', response.data.access_token);
      const token = response.data.access_token || response.data.token;
      
      if (token) {
        tokenService.setToken(token);
        console.log('Token guardado:', token);
        
        // Verifica inmediatamente si se puede decodificar
        const decoded = tokenService.decodeToken();
        console.log('Token decodificado inmediatamente después de guardar:', decoded);
        
        return response.data;
      } else {
        console.error('No se encontró token en la respuesta:', response.data);
      }
    } catch (error) {
      throw new Error('Error en el login');
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
  getUserRole(): string | string[] | null {
    return tokenService.getUserRole();
  }

  getRedirectUrl(): string {
    const role = this.getUserRole();
    
    if (!role) return '/login';
    
    
    if (Array.isArray(role)) {

      return getDashboardByRole(role[0]);
    }
    
    // Si es un string, lo usamos directamente
    return getDashboardByRole(role);
  }

  isAuthenticated(): boolean {
     const valid = tokenService.isTokenValid();
     if (!valid) this.logout();
     return valid;
  }

}

export default new AuthService();