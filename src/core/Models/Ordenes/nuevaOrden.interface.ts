// Usa siempre la misma forma:
import type { NotificacionCompleta } from '../Notificaciones/notinueva.interface';

 interface NuevaObservacionModalProps {
  show: boolean;
  onHide: () => void;
  notificacion: NotificacionCompleta | null;
  onGuardar: (id: number, observacion: string) => Promise<void>;
}

export type { NuevaObservacionModalProps };