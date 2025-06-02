export interface NotificacionDTO {
    descripcion: string;
    subsidiaria_id: number;
    clase_id?: number;
    departamento_id?: number;
    fecha_notificacion?: string | null;
    estado_notificacion: string;
    tipo_notificacion: string;
    usuarioCreador: {
        id: number;
    };
    usuarioModificador?: {
        id: number;
    } | null;
}