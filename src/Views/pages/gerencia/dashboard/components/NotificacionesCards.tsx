import React from 'react';
import type { NotificacionCompleta } from '../../../../../core/Models/Notificaciones/notinueva.interface';

interface NotificacionesCardsProps {
  notificaciones: NotificacionCompleta[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (notificacion: NotificacionCompleta) => void;
  handleOpenAceptarModal: (notificacion: NotificacionCompleta) => void;
  handleOpenRechazarModal: (notificacion: NotificacionCompleta) => void;
  handleOpenEditarModal: (notificacion: NotificacionCompleta) => void;
}

const NotificacionesCards: React.FC<NotificacionesCardsProps> = ({
  notificaciones,
  getTipoCard,
  formatearFecha,
  handleShowDetails,
  handleOpenAceptarModal,
  handleOpenRechazarModal,
  handleOpenEditarModal
}) => {
  return (
    <div className="cards-container">
      {notificaciones.map((notificacion) => {
        const tipo = getTipoCard(notificacion.estado_notificacion);
        return (
          <div key={notificacion.id} className={`card notification-card ${tipo}`}>
            <div className="card-headerr">
              <div className="card-header-left">
                <span className={`status-dot ${tipo}`}></span>
                <h5 className="card-title">Folio #{notificacion.id}</h5>
              </div>
              <span className={`status-badge status-${notificacion.estado_notificacion.toLowerCase().replace(/ /g, '-')}`}>
                {notificacion.estado_notificacion}
              </span>
            </div>
            
            <div className="card-body">
              <div className="card-info">
                <div className="info-row">
                  <span className="info-label">Cliente:</span>
                  <span className="info-value">
                    {notificacion.usuarioCreador ? 
                      `${notificacion.usuarioCreador.Nombre} ${notificacion.usuarioCreador.Apellido_Paterno} ${notificacion.usuarioCreador.Apellido_Materno}` : 
                      'Sin usuario'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tipo:</span>
                  <span className={`type-badge ${notificacion.tipo_notificacion?.toLowerCase()}`}>
                    {notificacion.tipo_notificacion === 'falla' ? 'Falla' : 'Instalación'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha:</span>
                  <span className="info-value">
                    {notificacion.fecha_notificacion ? formatearFecha(notificacion.fecha_notificacion.toString()) : 'Sin fecha'}
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
                
                {/* En revisión: Mostrar Aceptar y Cancelar */}
                {notificacion.estado_notificacion === 'en revisión' && (
                  <>
                    <button 
                      className="action-button accept-button"
                      onClick={() => handleOpenAceptarModal(notificacion)}
                    >
                      Aceptar
                    </button>
                    <button 
                      className="action-button cancel-button"
                      onClick={() => handleOpenRechazarModal(notificacion)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                
                {/* Para estados que no sean en revisión, Aceptada o Cancelada */}
                {notificacion.estado_notificacion !== 'en revisión' && 
                notificacion.estado_notificacion !== 'cancelada' && 
                notificacion.estado_notificacion !== 'aceptada' && (
                  <>
                    <button 
                      className="action-button change-status-button"
                      onClick={() => handleOpenAceptarModal(notificacion)}
                    >
                      Cambiar estado
                    </button>
                    <button 
                      className="action-button cancel-button"
                      onClick={() => handleOpenRechazarModal(notificacion)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                
                {/* Si está en estado Aceptada, solo botón de cancelar */}
                {notificacion.estado_notificacion === 'aceptada' && (
                <>
                  <button 
                    className="action-button cancel-button"
                    onClick={() => handleOpenRechazarModal(notificacion)}
                  >
                    Cancelar
                  </button>

                  <button 
                    className="action-button edit-button"
                    onClick={() => handleOpenEditarModal(notificacion)}
                  > 
                    Editar
                 </button>
                 </>
                  
                )}
                
                {/* Si ya está cancelada, solo botón de aceptar */}
                {notificacion.estado_notificacion === 'cancelada' && (
                  <button 
                    className="action-button accept-button"
                    onClick={() => handleOpenAceptarModal(notificacion)}
                  >
                    Aceptar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificacionesCards;