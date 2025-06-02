
import type { NotificacionDTO } from '../../Models/Notificaciones/notificacion.interface';
import type { NotificacionCompleta } from '../../Models/Notificaciones/notinueva.interface';
import apiClient from '../../Interceptors/http-interceptor';
import type { NotificacionEdo } from '../../Models/Notificaciones/notificacionestado.interface';

class NotificacionesService {

  
  async crearNotificacion(notificacion: NotificacionDTO): Promise<any> {
    try {
       const response = await apiClient.post( `/notificacion`, 
        notificacion, {
    });
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }
    async obtenerNotificaciones(): Promise<NotificacionCompleta[]> {
        try {
        const response = await apiClient.get('/notificacion');
        return response.data;
        } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
        }
    }

    async obtenerNotificacionesGerencia(): Promise<NotificacionCompleta[]> {
        try {
        const response = await apiClient.get('/notificacion/Gerencia');
        return response.data;
        } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
        }
    }

    async EnviarNotificacion(notificacion: NotificacionEdo): Promise<any> {
        try {
            const response = await apiClient.post('/comentarios-notificacion', notificacion);
            return response.data;
        } catch (error) {
            console.error('Error al enviar notificación:', error);
            throw error;
        }
        //comentarios-notificacion
    }

}

export default new NotificacionesService();