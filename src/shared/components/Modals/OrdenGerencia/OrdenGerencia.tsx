import React from 'react';
import BaseModal from '../BaseModal';
import type { OrdenTrabajo } from '../../../../core/Models/Ordenes/orden.interface';


interface OrdenGerenciaModalProps {
  show: boolean;
  onHide: () => void;
  orden: OrdenTrabajo | null;
}

export const OrdenGerenciaModal: React.FC<OrdenGerenciaModalProps> = ({
  show,
  onHide,
  orden
}) => {
  if (!orden) return null;

  // Función para formatear fechas
  const formatearFecha = (fechaStr: string | Date) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Determinar la clase CSS según el estado de la orden
  const getStatusClass = () => {
    switch (orden.estado?.toLowerCase()) {
      case 'preaprobada':
        return 'status-pending';
      case 'en proceso':
        return 'status-progress';
      case 'aprobada':
      case 'completada':
        return 'status-completed';
      case 'rechazada':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  // Personalizar el footer del modal
  const customFooter = (
    <div className="modal-footer-custom">
      <button className="btn btn-secondary" onClick={onHide}>
        Cerrar
      </button>
    </div>
  );

  return (
    <BaseModal 
      show={show} 
      onHide={onHide} 
      title={`Detalle de Orden de Trabajo #${orden.id}`}
      footer={customFooter}
      size="lg"
    >
      <div className="orden-gerencia-container">
        {/* Encabezado con estado y fechas */}
        <div className="orden-gerencia-header">
          <div className={`status-indicator ${getStatusClass()}`}>
            Estado: {orden.estado || 'Sin estado'}
          </div>
          <div className="orden-date">
            Creada: {formatearFecha(orden.fecha_creacion)}
          </div>
        </div>
        
        {/* Información de la orden */}
        <div className="orden-gerencia-section">
          <h5>Información de la Orden</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Folio:</strong> {orden.id}
            </div>
            <div className="detail-item">
              <strong>Notificación:</strong> #{orden.notificacion?.id || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Fecha Estimada de Inicio:</strong> {formatearFecha(orden.fecha_inicio)}
            </div>
            <div className="detail-item">
              <strong>Fecha Estimada de Termino:</strong> {formatearFecha(orden.fecha_fin)}
            </div>
          </div>
        </div>
        
        {/* Información del técnico */}
        <div className="orden-gerencia-section">
          <h5>Técnico Asignado</h5>
          {orden.tecnico ? (
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Nombre:</strong> {orden.tecnico.nombre}
              </div>
              <div className="detail-item">
                <strong>Teléfono:</strong> {orden.tecnico.numero_Telefono}
              </div>
            </div>
          ) : (
            <p className="no-data">No hay técnico asignado</p>
          )}
        </div>
        
        {/* Información de la notificación */}
        <div className="orden-gerencia-section">
          <h5>Detalles de la Notificación</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Estado:</strong> {orden.notificacion?.estado_notificacion || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Fecha:</strong> {orden.notificacion?.fecha_notificacion ? formatearFecha(orden.notificacion.fecha_notificacion) : 'N/A'}
            </div>
            <div className="detail-item full-width">
              <strong>Descripción:</strong> {orden.notificacion?.descripcion || 'Sin descripción'}
            </div>
          </div>
        </div>
        
        {/* Información de ubicación */}
        <div className="orden-gerencia-section">
          <h5>Ubicación</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Subsidiaria:</strong> {orden.notificacion?.subsidiaria || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Departamento:</strong> {orden.notificacion?.departamento || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Clase:</strong> {orden.notificacion?.clase || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Solicitante:</strong> {orden.notificacion?.solicitante || 'N/A'}
            </div>
          </div>
        </div>
       
      </div>
    </BaseModal>
  );
};