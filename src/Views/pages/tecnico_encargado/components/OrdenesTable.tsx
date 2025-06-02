import React from 'react';
import { Table } from 'react-bootstrap';

import type { OrdenTrabajoSimplificada } from '../../../../core/Models/Ordenes/ordenobtener.interface';

interface OrdenesTableProps {
  ordenes: OrdenTrabajoSimplificada[];
  getTipoCard: (estado: string) => string;
  formatearFecha: (fecha: string) => string;
  handleShowDetails: (orden: OrdenTrabajoSimplificada) => void;
}

const OrdenesTable: React.FC<OrdenesTableProps> = ({
  ordenes,
  getTipoCard,
  formatearFecha,
  handleShowDetails
}) => {
  return (
    <Table responsive striped hover className="ordenes-table">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Descripcion</th>
          <th>Tipo</th>
          <th>Usuario que reporto</th>
          <th>Fecha Estimada de termino</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => {
          const tipo = getTipoCard(orden.estado || '');
          return (
            <tr key={orden.id} className={tipo}>
              <td>
                <div className="folio-cell">
                  <span className={`status-dot ${tipo}`}></span>
                  {orden.id}
                </div>
              </td>
              <td>{orden.notificacion?.descripcion || 'N/A'}</td>
              <td>
                 <span className=""></span>
                  {orden.notificacion.tipo_notificacion || 'N/A'}
              </td>
              <td>{orden.notificacion.solicitante}</td>
              <td>{formatearFecha(orden.fecha_fin)}</td>
              <td>
                <button 
                  className="action-button details-button"
                  onClick={() => handleShowDetails(orden)}
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

export default OrdenesTable;