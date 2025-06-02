// Actualiza tu interfaz FormularioNotificacion
export interface FormularioNotificacion {
  descripcion: string;
  subsidiaria_id: number;
  clase_id: number;
  departamento_id: number;
  estado_notificacion: string;
  tipo_notificacion: string;
  usuarioCreador: { id: number };
  usuarioModificador: null | { id: number };
}