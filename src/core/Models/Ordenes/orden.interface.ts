import type { NotificacionCompleta } from '../Notificaciones/notinueva.interface';

export interface OrdenTrabajo {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_creacion: string | Date;
  estado: string;
  tecnico?: {
    id: number;
    nombre: string;
    numero_Telefono: string;
  };
  notificacion: {
    id: number;
    estado_notificacion: string;
    fecha_notificacion: string;
    descripcion: string;
    subsidiaria: string;
    departamento: string;
    clase: string;
    solicitante: string;
    tipo_notificacion?: string;
  };
}

// Estado para cambiar órdenes
export interface OrdenEstadoDTO {
  observacion: string | null;
  orden_id: number;
  estado: string;
}

// Para respuestas del servidor
export interface OrdenResponse {
  success: boolean;
  message: string;
  data?: OrdenTrabajo | OrdenTrabajo[];
}