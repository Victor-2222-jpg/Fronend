import React from 'react';
import { Table } from 'react-bootstrap';
import type { NotificacionCompleta } from '../../../../core/Models/Notificaciones/notinueva.interface';

interface NotificacionesTableProps {
  notificaciones: NotificacionCompleta[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (notificacion: NotificacionCompleta) => void;
}

const NotificacionesTable: React.FC<NotificacionesTableProps> = ({
  notificaciones,
  getTipoCard,
  formatearFecha,
  handleShowDetails
}) => {
  return (
    <Table responsive striped hover className="notificaciones-table">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Subsidiaria</th>
          <th>Departamento</th>
          <th>Clase</th>
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
              <td>{notificacion.ClaseDepartamentoSubsidiaria?.subsidiaria?.nombre || 'Sin subsidiaria'}</td>
              <td>{notificacion.ClaseDepartamentoSubsidiaria?.departamento?.nombre || 'Sin departamento'}</td>
              <td>{notificacion.ClaseDepartamentoSubsidiaria?.clase?.nombre || 'Sin clase'}</td>
              <td>
                <span className={`type-badge ${(notificacion.tipo_notificacion || 'falla').toLowerCase()}`}>
                  {notificacion.tipo_notificacion === 'instalacion' ? 'Instalación' : 
                   notificacion.tipo_notificacion === 'correctiva' ? 'Correctiva' : 'Falla'}
                </span>
              </td>
              <td>
                <span className={`status-badge ${notificacion.estado_notificacion.toLowerCase().replace(/ /g, '-')}`}>
                  {notificacion.estado_notificacion}
                </span>
              </td>
              <td>{formatearFecha(notificacion.fecha_notificacion?.toString() || '')}</td>
              <td>
                <button 
                  className="action-button details-button"
                  onClick={() => handleShowDetails(notificacion)}
                >
                  Detalles
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default NotificacionesTable;