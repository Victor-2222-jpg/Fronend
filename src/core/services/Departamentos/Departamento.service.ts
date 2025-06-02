import apiClient from '../../Interceptors/http-interceptor';
import type { Departamento } from '../../Models/departamento.interface';

export class DepartamentoService {
  async obtenerDepartamentos(): Promise<Departamento[]> {
    try {
      const response = await apiClient.get('/departamentos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw error;
    }
  }
}