import apiClient from '../../Interceptors/http-interceptor';
import type { Subsidiaria } from '../../Models/Subsidiaria/subsidiaria.interface';


export class SubsidiariaService {
  
  async obtenerSubsidiarias(): Promise<Subsidiaria[]> {
    try {
      const response = await apiClient.get('/subsidiaria');
      return response.data;
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw error;
    }
  }
}