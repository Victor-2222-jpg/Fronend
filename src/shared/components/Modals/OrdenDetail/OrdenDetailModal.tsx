import React from 'react';
import BaseModal from '../BaseModal';
import { Button } from 'react-bootstrap';
import './OrdenDetailModal.css';
import type { OrdenTrabajoSimplificada } from '../../../../core/Models/Ordenes/ordenobtener.interface';

interface OrdenDetailModalProps {
  show: boolean;
  onHide: () => void;
  orden: OrdenTrabajoSimplificada | null;
  onActualizarEstado?: (nuevoEstado: string) => void;
}

const OrdenDetailModal: React.FC<OrdenDetailModalProps> = ({
  show,
  onHide,
  orden,
  onActualizarEstado
}) => {
  if (!orden) return null;

  const getStatusClass = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'en proceso':
        return 'info';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const statusClass = getStatusClass(orden.estado);

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
      {(orden.estado === 'pendiente' || orden.estado === 'en proceso') && onActualizarEstado && (
        <Button 
          variant="primary" 
          onClick={() => onActualizarEstado(orden.estado === 'pendiente' ? 'en proceso' : 'completada')}
        >
          {orden.estado === 'pendiente' ? 'Iniciar trabajo' : 'Marcar como completada'}
        </Button>
      )}
    </>
  );

  return (
    <BaseModal 
      show={show} 
      onHide={onHide} 
      title={`Detalle de Orden de Trabajo #${orden.id}`}
      footer={customFooter}
    >
      <div className="orden-detail-container">
        <div className="orden-detail-header">
          <div className={`status-indicator ${statusClass}`}>
            Estado: {orden.estado}
          </div>
          <div className="orden-date">
            Fecha creación: {orden.fecha_creacion ? formatearFecha(orden.fecha_creacion.toString()) : 'N/A'}
          </div>
        </div>
        
        <div className="orden-detail-section">
          <h5>Información de la Orden</h5>
          <div className="detail-row">
            <strong>Folio#:</strong> {orden.id}
          </div>
          <div className="detail-row">
            <strong>Fecha Estimada de Inicio:</strong> {formatearFecha(orden.fecha_inicio)}
          </div>
          <div className="detail-row">
            <strong>Fecha Estimada de Termino:</strong> {formatearFecha(orden.fecha_fin)}
          </div>
        </div>

        <div className="orden-detail-section">
          <h5>Descripción</h5>
          <p className="orden-description">{orden.notificacion.descripcion}</p>
        </div>
        
        <div className="orden-detail-section">
          <h5>Detalles de la Subsidiaria</h5>
          <div className="detail-row">
            <strong>Subsidiaria:</strong> {orden.notificacion.subsidiaria}
          </div>
          <div className="detail-row">
            <strong>Departamento:</strong> {orden.notificacion.departamento}
          </div>
          <div className="detail-row">
            <strong>Clase:</strong> {orden.notificacion.clase}
          </div>
        </div>
        
        <div className="orden-detail-section">
          <h5>Información del Solicitante</h5>
          <div className="detail-row">
            <strong>Nombre:</strong> {orden.notificacion.solicitante}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default OrdenDetailModal;