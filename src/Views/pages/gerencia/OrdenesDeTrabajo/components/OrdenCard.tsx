import React from 'react';
import type { OrdenTrabajo } from '../../../../../core/Models/Ordenes/orden.interface';

interface OrdenCardProps {
  orden: OrdenTrabajo;
  tipo: string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (orden: OrdenTrabajo) => void;
  handleOpenAprobarModal: (orden: OrdenTrabajo) => void;
}

const OrdenCard: React.FC<OrdenCardProps> = ({
  orden,
  tipo,
  formatearFecha,
  handleShowDetails,
  handleOpenAprobarModal,
}) => {
  return (
    <div className={`card notification-card ${tipo}`}>
      <div className="card-headerr">
        <div className="notification-id">
          <span className={`status-dot ${tipo}`}></span>
          <h3>Orden de trabajo #{orden.id}</h3>
        </div>
        <div className="notification-date">
          <span className="date-label">Fecha creación:</span>
          <span className="date-value">
            {formatearFecha(orden.fecha_creacion.toString())}
          </span>
        </div>
      </div>
      <div className="card-content">
        <div className="notification-status">
          <strong>Estado de la orden:</strong>
          <span className={`status-badge ${orden.estado.toLowerCase().replace(/ /g, '-')}`}>
            {orden.estado}
          </span>
        </div>

        <div className="notification-type mt-2">
          <strong>Tipo: </strong>
          <span className={`type-badge ${orden.notificacion?.tipo_notificacion?.toLowerCase() || ''}`}>
            {orden.notificacion?.tipo_notificacion === 'falla' ? 'Falla' : 'Instalación'}
          </span>
        </div>
        
        {orden.fecha_inicio && (
          <div className="notification-date-range mt-2">
            <strong>Fecha estimada de inicio: </strong>
            <span>{formatearFecha(orden.fecha_inicio)}</span>
          </div>
        )}
        
        {orden.fecha_fin && (
          <div className="notification-date-range">
            <strong>Fecha estimada de fin: </strong>
            <span>{formatearFecha(orden.fecha_fin)}</span>
          </div>
        )}

        {orden.tecnico && (
          <div className="notification-assigned mt-2">
            <strong>Técnico asignado: </strong>
            <span className="assigned-user">
              {orden.tecnico.nombre} 
            </span>
          </div>
        )}
      </div>
      <div className="card-actions">
        <button 
          className="action-button details-button"
          onClick={() => handleShowDetails(orden)}
        >
          Detalles
        </button>
        
        {orden.estado === 'PreAprobada' && (
          <button 
            className="action-button accept-button"
            onClick={() => handleOpenAprobarModal(orden)}
          >
            Iniciar
          </button>
        )}
        
        {orden.estado !== 'PreAprobada' && orden.estado !== 'Rechazada' && (
          <button 
            className="action-button change-status-button"
            onClick={() => handleOpenAprobarModal(orden)}
          >
            Cambiar estado
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdenCard;