import React from 'react';
import { Table } from 'react-bootstrap';
import type { OrdenTrabajo } from '../../../../../core/Models/Ordenes/orden.interface';

interface OrdenTableProps {
  ordenes: OrdenTrabajo[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (orden: OrdenTrabajo) => void;
  handleOpenAprobarModal: (orden: OrdenTrabajo) => void;
}

const OrdenTable: React.FC<OrdenTableProps> = ({
  ordenes,
  getTipoCard,
  formatearFecha,
  handleShowDetails,
  handleOpenAprobarModal,
}) => {
  return (
    <Table responsive striped hover className="ordenes-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Estado</th>
          <th>Tipo</th>
          <th>Fecha Creación</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Técnico</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => {
          const tipo = getTipoCard(orden.estado);
          return (
            <tr key={orden.id} className={tipo}>
              <td>
                <div className="folio-cell">
                  <span className={`status-dot ${tipo}`}></span>
                  {orden.id}
                </div>
              </td>
              <td>
                <span className={`status-badge ${orden.estado.toLowerCase().replace(/ /g, '-')}`}>
                  {orden.estado}
                </span>
              </td>
              <td>
                <span className={`type-badge ${orden.notificacion?.tipo_notificacion?.toLowerCase() || ''}`}>
                  {orden.notificacion?.tipo_notificacion === 'falla' ? 'Falla' : 'Instalación'}
                </span>
              </td>
              <td>{formatearFecha(orden.fecha_creacion.toString())}</td>
              <td>{orden.fecha_inicio ? formatearFecha(orden.fecha_inicio) : 'N/A'}</td>
              <td>{orden.fecha_fin ? formatearFecha(orden.fecha_fin) : 'N/A'}</td>
              <td>{orden.tecnico?.nombre || 'No asignado'}</td>
              <td>
                <div className="table-actions">
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
                      Cambiar
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

export default OrdenTable;