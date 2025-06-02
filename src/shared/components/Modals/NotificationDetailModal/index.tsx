import React from 'react';
import BaseModal from '../BaseModal';
import { Button, Table } from 'react-bootstrap';
import './NotificationDetail.css';
import type { NotificacionDetalle } from '../../../../core/Models/Notificaciones/notificaciondetalle.interface';


interface NotificationDetailModalProps {
  show: boolean;
  onHide: () => void;
  notificacion: NotificacionDetalle | null;
  onAceptar?: () => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  show,
  onHide,
  notificacion,
  onAceptar
}) => {
  if (!notificacion) return null;

  const getStatusClass = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'en revisión':
      case 'en revision':
        return 'warning'; // amarillo
      case 'aprobada':
      case 'apobada': 
        return 'success'; // verde
      case 'cancelada':
        return 'error'; // rojo
      case 'terminada':
        return 'info'; // azul
      case 'cerrada':
        return 'closed'; // gris o el color que prefieras
      default:
        return 'default';
    }
  };

  const statusClass = getStatusClass(notificacion.estado_notificacion);

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Footer personalizado con botones de acción
  const customFooter = (
    <>
      <Button variant="secondary" onClick={onHide}>
        Cerrar
      </Button>
      {notificacion.estado_notificacion === 'Pendiente' && onAceptar && (
        <Button variant="primary" onClick={onAceptar}>
          Aceptar Notificación
        </Button>
      )}
    </>
  );

  return (
    <BaseModal 
      show={show} 
      onHide={onHide} 
      title={`Detalle de Notificación #${notificacion.id}`}
      footer={customFooter}
    >
      <div className="notification-detail-container">
        <div className="notification-detail-header">
          <div className={`status-indicator ${statusClass}`}>
            Estado: {notificacion.estado_notificacion}
          </div>
          <div className="notification-date">
            Fecha: {formatearFecha(notificacion.fecha_notificacion.toString())}
          </div>
        </div>
        
         <div className="notification-detail-section">
          <h5>Observaciones</h5>
          {notificacion.comentarios && notificacion.comentarios.length > 0 ? (
            <div className="observaciones-tabla">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Observación</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {notificacion.comentarios.map(comentario => (
                    <tr key={comentario.id}>
                      <td>{comentario.comentario}</td>
                      <td>
                        {comentario.fecha 
                          ? formatearFecha(comentario.fecha.toString()) 
                          : 'Sin fecha'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="sin-comentarios">No hay observaciones para esta notificación.</p>
          )}
        </div>

        {notificacion.usuarioCreador && (
        <div className="notification-detail-section">
          <h5>Información del Solicitante</h5>
          <div className="detail-row">
            <strong>Nombre:</strong> {notificacion.usuarioCreador.Nombre + ' ' + notificacion.usuarioCreador. Apellido_Paterno + ' ' + notificacion.usuarioCreador.Apellido_Materno}
          </div>
          <div className="detail-row">
            <strong>Correo:</strong> {notificacion.usuarioCreador.email}
          </div>
        </div>
      )}
        
        <div className="notification-detail-section">
          <h5>Descripción del Problema</h5>
          <p className="notification-description">{notificacion.descripcion}</p>
        </div>
        
        
      </div>
    </BaseModal>
  );
};

export default NotificationDetailModal;