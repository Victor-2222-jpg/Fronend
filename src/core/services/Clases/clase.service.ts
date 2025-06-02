import apiClient from '../../Interceptors/http-interceptor';
import type { Clase } from '../../Models/clase.interface';

export class ClaseService {
  async obtenerClases(): Promise<Clase[]> {
    try {
      const response = await apiClient.get('/clases');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clases:', error);
      throw error;
    }
  }
}