import type { ClaseDepartamentoSubsidiaria } from '../clase_departamento_subsidiaria/clase_departamento_sunsidiaria.interface';
import type { UsuarioCreador } from '../usuariocreador.interface';
import type Comentario from './comentario.interface';


export interface NotificacionDetalle {
  id: number;
  ClaseDepartamentoSubsidiaria: ClaseDepartamentoSubsidiaria;
  descripcion: string;
  fecha_notificacion: Date;
  estado_notificacion: string;
  usuarioCreador: UsuarioCreador;
  comentarios: Comentario[] | null;
}


