import React from 'react';
import type { OrdenTrabajoSimplificada } from '../../../../core/Models/Ordenes/ordenobtener.interface';
import { Button } from 'react-bootstrap';
import { FaHistory, FaTasks } from 'react-icons/fa';



interface OrdenesCardsProps {
  ordenes: OrdenTrabajoSimplificada[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (orden: OrdenTrabajoSimplificada) => void;
  handleShowSeguimiento: (orden: OrdenTrabajoSimplificada) => void;
  handleShowHistorial: (orden: OrdenTrabajoSimplificada) => void;
}

const OrdenesCards: React.FC<OrdenesCardsProps> = ({
  ordenes,
  getTipoCard,
  formatearFecha,
  handleShowDetails,
  handleShowSeguimiento,
  handleShowHistorial
}) => {
  return (
    <div className="cards-container">
      {ordenes.length === 0 ? (
        <div className="empty-message">No hay órdenes disponibles</div>
      ) : (
        ordenes.map((orden) => {
          const tipo = getTipoCard(orden.estado || '');
          return (
            <div key={orden.id} className={`card orden-card ${tipo}`}>
              <div className="card-headerr">
                <div className="orden-id">
                  <span className={`status-dot ${tipo}`}></span>
                  <h3>Orden de trabajo #{orden.id}</h3>
                </div>
                <div className="orden-notificacion">
                  <span className="notification-label">Notificación:</span>
                  <span className="notification-value">#{orden.notificacion?.id || 'N/A'}</span>
                </div>
              </div>
              <div className="card-content">
                {orden.notificacion.descripcion && (
                  <div className="orden-descripcion">
                    <strong>Descripción:</strong>
                    <p>{orden.notificacion.descripcion}</p>
                  </div>
                )}
                <div className="fecha-item">
                  <strong>Tipo:</strong> {orden.notificacion?.tipo_notificacion || 'N/A'}
                </div>
                <div className="fecha-item">
                  <strong>Usuario que reporto:</strong> {orden.notificacion?.solicitante || 'N/A'}
                </div>
                <div className="fecha-item">
                  <strong>Fecha estimada de termino:</strong> {formatearFecha(orden.fecha_fin)}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="action-button details-button"
                  onClick={() => handleShowDetails(orden)}
                >
                  Ver detalles
                </button>
                <Button 
                    variant="outline-success"
                    className="flex-fill"
                    onClick={() => handleShowSeguimiento(orden)}
                  >
                    <FaTasks className="me-1" />
                    Seguimiento
                  </Button>

                  <Button 
                  variant="outline-info"
                  className="flex-fill"
                  onClick={() => handleShowHistorial(orden)}
                >
                  <FaHistory className="me-1" />
                  Historial
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrdenesCards;