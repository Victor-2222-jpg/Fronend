import type { Tecnico } from "./Tecnico.interface";

export interface NotificacionSimplificada {
  id: number;
  descripcion: string;
  tipo_notificacion: string | null;
  subsidiaria: string;
  departamento: string;
  clase: string;
  solicitante: string;
}

export interface OrdenTrabajoSimplificada {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_creacion: Date | null;
  estado: string;
  
  tecnico_responsable?: Tecnico | null;
  notificacion: NotificacionSimplificada;
  
}

export interface OrdenesTrabajoRespuesta {
  ordenesTrabajo: OrdenTrabajoSimplificada[];
  
}