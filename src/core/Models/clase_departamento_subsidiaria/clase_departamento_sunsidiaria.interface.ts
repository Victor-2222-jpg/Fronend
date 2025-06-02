import type { Clase } from "../clase.interface";
import type { Departamento } from "../departamento.interface"
import type { Subsidiaria } from "../Subsidiaria/subsidiaria.interface";

export interface ClaseDepartamentoSubsidiaria {
  id: number;
  departamento: Departamento;
  subsidiaria: Subsidiaria;
  clase: Clase;
};
