import React, { useState } from 'react';
import { NotificationDetailModal } from '../../../../shared/components/Modals';
import EstadoNotificacionModal from '../../../../shared/components/Modals/EstadoNotificacion';
import '../dashboard/dashboard.css';
import './dashboardOrden.css';
import Pagination from '../../../../shared/components/Pagination';
import { useDashboardOrden } from './useDashboardOrden';
import OrdenAsignacionModal from '../../../../shared/components/Modals/OrdenAsignacion';
import { OrdenGerenciaModal } from '../../../../shared/components/Modals/OrdenGerencia/OrdenGerencia';
import OrdenCard from './components/OrdenCard';
import OrdenTable from './components/OrdenTable';
// Importar íconos
import { BsTable, BsGrid } from 'react-icons/bs';
import FiltersToolbar from '../../../../shared/components/Filtro/FiltersToolbar';

const DashboardOrden: React.FC = () => {
  // Estado para controlar la vista (tarjetas o tabla)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // Función para alternar entre vistas
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'card' ? 'table' : 'card');
  };
  
  const {
    ordenes,
    loading,
    error,
    showEstadoModal,
    showAsignacionModal,
    selectedOrdenAccion,
    accionActual,
    showDetailModal,
    selectedOrden,
    handleShowDetails,
    handleCloseAsignacionModal,
    handleConfirmAsignacion,
    handleCloseModal,
    handleOpenAprobarModal,
    handleOpenRechazarModal,
    handleCloseEstadoModal,
    handleConfirmEstado,
    getTipoCard,
    formatearFecha,
    loadingTecnicos,
    stateOptions,
    userOptions,
    tecnicos,
    currentPage,
    totalPages,
    handlePageChange
  } = useDashboardOrden();

  return (
    <>
      <div className="dashboard-container" style={{ paddingTop: '90px' }}>
       <FiltersToolbar
          // Usuario (opcional)
          showUserFilter={true}
          userOptions={userOptions}
          userFilterValue=""
          onUserFilterChange={() => { } } // Implementar en el hook


          // Estado
          stateOptions={stateOptions}


          // Vista
          showViewToggle={true}
          viewMode={viewMode as 'cards' | 'table'}
          onViewModeChange={toggleViewMode} stateFilterValue={''} onStateFilterChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateFromValue={''} onDateFromChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateToValue={''} onDateToChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } onApplyFilters={function (): void {
            throw new Error('Function not implemented.');
          } } onResetFilters={function (): void {
            throw new Error('Function not implemented.');
          } } filtersApplied={false}        />

        {loading ? (
          <div className="loading-message">Cargando órdenes de trabajo...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className={viewMode === 'table' ? 'table-container' : 'cards-view-container'}>
            {ordenes.length === 0 ? (
              <div className="empty-message">No hay órdenes de trabajo disponibles</div>
            ) : (
              viewMode === 'card' ? (
                // Vista de tarjetas
                <div className="cards-container">
                  {ordenes.map((orden) => (
                    <OrdenCard
                      key={orden.id}
                      orden={orden}
                      tipo={getTipoCard(orden.estado)}
                      formatearFecha={formatearFecha}
                      handleShowDetails={handleShowDetails}
                      handleOpenAprobarModal={handleOpenAprobarModal}
                    />
                  ))}
                </div>
              ) : (
                // Vista de tabla
                <div className="table-container">
                  <OrdenTable
                    ordenes={ordenes}
                    getTipoCard={getTipoCard}
                    formatearFecha={formatearFecha}
                    handleShowDetails={handleShowDetails}
                    handleOpenAprobarModal={handleOpenAprobarModal}
                  />
                </div>
              )
            )}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <OrdenGerenciaModal
        show={showDetailModal}
        onHide={handleCloseModal}
        orden={selectedOrden}
      />
      
      <EstadoNotificacionModal
        show={showEstadoModal}
        onHide={handleCloseEstadoModal}
        onConfirm={handleConfirmEstado}
        accion={accionActual}
        id={selectedOrdenAccion?.id}
      />

      <OrdenAsignacionModal
        show={showAsignacionModal}
        onHide={handleCloseAsignacionModal}
        orden={selectedOrdenAccion}
        tecnicos={tecnicos}
        onConfirm={handleConfirmAsignacion}
        isLoading={loadingTecnicos}
      />
    </>
  );
};

export default DashboardOrden;