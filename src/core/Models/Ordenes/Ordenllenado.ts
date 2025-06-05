import type { Tecnico } from "./Tecnicosenvio";

export interface OrdenLlenado {
    orden_trabajo_id: number;
    tecnicos: Tecnico[];
}