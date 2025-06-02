import React from 'react';
import { Table } from 'react-bootstrap';
import type { NotificacionCompleta } from '../../../../../core/Models/Notificaciones/notinueva.interface';

interface NotificacionesTableProps {
  notificaciones: NotificacionCompleta[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (notificacion: NotificacionCompleta) => void;
  handleOpenAceptarModal: (notificacion: NotificacionCompleta) => void;
  handleOpenRechazarModal: (notificacion: NotificacionCompleta) => void;
  handleOpenEditarModal: (notificacion: NotificacionCompleta) => void;
}

const NotificacionesTable: React.FC<NotificacionesTableProps> = ({
  notificaciones,
  getTipoCard,
  formatearFecha,
  handleShowDetails,
  handleOpenAceptarModal,
  handleOpenRechazarModal,
  handleOpenEditarModal
}) => {
  return (
    <Table responsive striped hover className="notificaciones-table">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Cliente</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
          
        </tr>
      </thead>
      <tbody>
        {notificaciones.map((notificacion) => {
          const tipo = getTipoCard(notificacion.estado_notificacion);
          return (
            <tr key={notificacion.id} className={tipo}>
              <td>
                <div className="folio-cell">
                  <span className={`status-dot ${tipo}`}></span>
                  {notificacion.id}
                </div>
              </td>
              <td>
                {notificacion.usuarioCreador ? 
                  `${notificacion.usuarioCreador.Nombre} ${notificacion.usuarioCreador.Apellido_Paterno} ${notificacion.usuarioCreador.Apellido_Materno}` : 
                  'Sin usuario'}
              </td>
              <td>
                <span className={`type-badge ${notificacion.tipo_notificacion?.toLowerCase()}`}>
                  {notificacion.tipo_notificacion === 'falla' ? 'Falla' : 'Instalación'}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${notificacion.estado_notificacion.toLowerCase().replace(/ /g, '-')}`}>
                  {notificacion.estado_notificacion}
                </span>
              </td>
              <td>
                {notificacion.fecha_notificacion ? formatearFecha(notificacion.fecha_notificacion.toString()) : 'Sin fecha'}
              </td>
              <td>
                <div className="table-actions">
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default NotificacionesTable;