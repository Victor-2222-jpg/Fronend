
import type { ClaseDepartamentoSubsidiaria } from "../clase_departamento_subsidiaria/clase_departamento_sunsidiaria.interface";
import type { Subsidiaria } from "../Subsidiaria/subsidiaria.interface";
import type { UsuarioCreador } from "../usuariocreador.interface";
import type Comentario from "./comentario.interface";


export interface NotificacionCompleta {
  id: number;
  ClaseDepartamentoSubsidiaria?: ClaseDepartamentoSubsidiaria;
  descripcion: string;
  fecha_notificacion: Date;
  estado_notificacion: string;
  fecha_creacion: Date | null;
  fecha_modificacion: Date | null;
  tipo_notificacion: string | null;
  usuarioCreador:UsuarioCreador| null;
  comentarios: Comentario[] | null;
}
