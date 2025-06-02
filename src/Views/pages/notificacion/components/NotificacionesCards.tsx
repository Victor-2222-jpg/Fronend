import React from 'react';
import type { NotificacionCompleta } from '../../../../core/Models/Notificaciones/notinueva.interface';

interface NotificacionesCardsProps {
  notificaciones: NotificacionCompleta[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (notificacion: NotificacionCompleta) => void;
}

const NotificacionesCards: React.FC<NotificacionesCardsProps> = ({
  notificaciones,
  getTipoCard,
  formatearFecha,
  handleShowDetails
}) => {
  return (
    <div className="cards-container">
      {notificaciones.length === 0 ? (
        <div className="empty-message">No hay notificaciones disponibles</div>
      ) : (
        notificaciones.map((notificacion) => {
          const tipo = getTipoCard(notificacion.estado_notificacion);
          return (
            <div key={notificacion.id} className={`card notification-card ${tipo}`}>
              <div className="card-headerr">
                <div className="notification-id">
                  <span className={`status-dot ${tipo}`}></span>
                  <h3>Folio notificación: {notificacion.id}</h3>
                </div>
                <div className="notification-date">
                  <span className="date-label">Fecha:</span>
                  <span className="date-value">
                    {notificacion.fecha_notificacion ? formatearFecha(notificacion.fecha_notificacion.toString()) : 'Sin fecha'}
                  </span>
                </div>
              </div>
              <div className="card-content">
                <div className="notification-location">
                  <div className="location-type">
                    <strong>Subsidiaria:</strong> {notificacion.ClaseDepartamentoSubsidiaria?.subsidiaria?.nombre || 'No disponible'}
                  </div>
                  <div className="location-type">
                    <strong>Clase:</strong> {notificacion.ClaseDepartamentoSubsidiaria?.clase?.nombre || 'No disponible'}
                  </div>
                  <div className="location-detail">
                    <strong>Departamento:</strong> {notificacion.ClaseDepartamentoSubsidiaria?.departamento?.nombre || 'No disponible'}
                  </div>
                  <div className="location-detail">
                    <strong>Ubicación:</strong> {notificacion.ClaseDepartamentoSubsidiaria?.clase?.ubicacion || 'No disponible'}
                  </div>
                </div>
                
                <div className="notification-status">
                  <strong>Estado:</strong>
                  <span className={`status-badge ${notificacion.estado_notificacion.toLowerCase().replace(/ /g, '-')}`}>
                    {notificacion.estado_notificacion}
                  </span>
                </div>
                
                <div className="notification-type mt-2">
                  <strong>Tipo:</strong>
                  <span className={`type-badge ${(notificacion.tipo_notificacion || 'falla').toLowerCase()}`}>
                    {notificacion.tipo_notificacion === 'instalacion' ? 'Instalación' : 
                     notificacion.tipo_notificacion === 'correctiva' ? 'Correctiva' : 'Falla'}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="action-button details-button"
                  onClick={() => handleShowDetails(notificacion)}
                >
                  Detalles
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default NotificacionesCards;