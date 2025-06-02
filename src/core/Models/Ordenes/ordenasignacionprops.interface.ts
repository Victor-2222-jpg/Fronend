import type { OrdenTrabajo } from "./orden.interface";
import type { Tecnico } from "./Tecnico.interface";

export interface OrdenAsignacionModalProps {
  show: boolean;
  onHide: () => void;
  orden: OrdenTrabajo | null;
  tecnicos: Tecnico[];
  onConfirm: (ordenId: number, tecnicoId: number, fechaInicio: string, fechaFin: string) => void;
  isLoading?: boolean;
}