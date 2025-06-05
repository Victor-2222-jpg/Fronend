import apiClient from "../../Interceptors/http-interceptor";
import type { OrdenTrabajo } from "../../Models/Ordenes/orden.interface";
import type { OrdenEnvio } from "../../Models/Ordenes/ordenenvio.interface";
import type { OrdenHistorial } from "../../Models/Ordenes/ordenhistorial";
import type { OrdenLlenado } from "../../Models/Ordenes/Ordenllenado";
import type { OrdenesTrabajoRespuesta, OrdenTrabajoSimplificada } from "../../Models/Ordenes/ordenobtener.interface";
import type { Tecnico } from "../../Models/Ordenes/Tecnico.interface";


interface ApiResponse {
  ordenesTrabajo: OrdenTrabajo[];
}

export class OrdenService {

    
  
    async obtenerOrdenes(): Promise<ApiResponse[]> {
        try {
        const response = await apiClient.get('/orden-trabajo/Gerencia');
        return response.data;
        } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
        }
    }

    async crearOrden(orden: OrdenEnvio): Promise<OrdenEnvio> {
         try {
       const response = await apiClient.post( `/orden-trabajo/Gerencia`, 
        orden, {
    });
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }

    }

    async obtenerTecnicos(): Promise<Tecnico[]> {
        try {
            const response = await apiClient.get('/tecnicos');
            return response.data;
        } catch (error) {
            console.error('Error al obtener técnicos:', error);
            throw error;
        }
    }

     async obtenerOrdenesTecnico(): Promise<OrdenTrabajoSimplificada[]> {
        try {
            const response = await apiClient.get('/tecnicos/asignados');
            const data: OrdenesTrabajoRespuesta = response.data;
            return data.ordenesTrabajo; // Retorna directamente el array de órdenes
        } catch (error) {
            console.error('Error al obtener órdenes del técnico:', error);
            throw error;
        }
    }
   

    async enviarDetalleOrden(orden: OrdenLlenado): Promise<OrdenLlenado> {
         try {
       const response = await apiClient.post( `/asignacion-tecnicos`, 
        orden, {
    });
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
    }

        async obtenerHistorial(ordenId: number): Promise<OrdenHistorial[]> {
        try {
            console.log(`Llamando a la API: /asignacion-tecnicos/orden/${ordenId}`);
            const response = await apiClient.get(`/asignacion-tecnicos/orden/${ordenId}`);
            
            console.log('Respuesta completa:', response.data);
            
            // La API devuelve directamente un array, no un objeto con propiedad historial
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            // Si no es un array, devolver array vacío
            console.warn('La API no devolvió un array:', response.data);
            return [];
            
        } catch (error) {
            console.error('Error al obtener historial de la orden:', error);
            throw error;
        }
    }
}