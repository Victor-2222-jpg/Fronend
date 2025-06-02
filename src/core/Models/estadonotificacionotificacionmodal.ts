import type { NotificacionAcciones } from "./Notificaciones/notificacionesacciones";

export interface EstadoNotificacionModalProps {
  show: boolean;
  onHide: () => void;
  notificacion: NotificacionAcciones | null;
  accion: 'aceptar' | 'cancelar' | 'actualizar';
  onConfirm: (id: number, nuevoEstado: string, observaciones: string | null) => void;
}