import type { Tecnico } from "./Tecnico.interface";

export interface OrdenEnvio {
    fecha_inicio: string; // Fecha de envío de la orden
    fecha_fin: string; // Fecha de finalización de la orden
    estado: string; // Estado de la orden (e.g., "Enviado", "Entregado", etc.)
    notificacion: {
        id: number; 
    }
    tecnicoResponsable: {
        id: number; // ID del técnico responsable
    }
    usuarioCreador: {
        id: number; // ID del usuario que creó la orden
    }


}; 