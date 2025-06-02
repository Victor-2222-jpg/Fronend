import React from 'react';
import './dashboard.css';
import { useTecnico } from './useTecnicoDashboard';
import OrdenesTable from './components/OrdenesTable';
import OrdenesCards from './components/OrdenesCards';
import Pagination from '../../../shared/components/Pagination';
import { BsTable, BsGrid } from 'react-icons/bs';
import '../notificacion/dashboard.css'; // Asegúrate de que este archivo CSS esté en la ruta correcta
import OrdenDetailModal from '../../../shared/components/Modals/OrdenDetail/OrdenDetailModal';
import FiltersToolbar from '../../../shared/components/Filtro/FiltersToolbar';

const Tecnico: React.FC = () => {
  const {
    ordenes,
    loading,
    error,
    showDetailModal,
    selectedOrden,
    totalPages,
    currentPage,
    handlePageChange,
    handleShowDetails,
    handleCloseModal,
    handleEstadoChange,
    handleFechaDesdeChange,
    handleFechaHastaChange,
    handleApplyFilters,
    handleResetFilters,
    getTipoCard,
    userOptions,
    stateOptions,
    formatearFecha,
    estadoFiltro,
    fechaDesde,
    fechaHasta,
    filtrosAplicados,
    viewMode,
    toggleViewMode
  } = useTecnico();

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
          stateFilterValue={estadoFiltro}


          // Acciones
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          filtersApplied={filtrosAplicados}

          // Vista
          showViewToggle={true}
          viewMode={viewMode as 'cards' | 'table'}
          onViewModeChange={toggleViewMode} onStateFilterChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateFromValue={''} onDateFromChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateToValue={''} onDateToChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } }        />

        {loading ? (
          <div className="loading-message">Cargando órdenes de trabajo...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className={viewMode === 'table' ? 'table-container' : 'cards-view-container'}>
            {ordenes.length === 0 ? (
              <div className="empty-message">No hay órdenes de trabajo disponibles</div>
            ) : (
              viewMode === 'table' ? (
                <OrdenesTable 
                  ordenes={ordenes}
                  getTipoCard={getTipoCard}
                  formatearFecha={formatearFecha}
                  handleShowDetails={handleShowDetails}
                />
              ) : (
                <OrdenesCards
                  ordenes={ordenes}
                  getTipoCard={getTipoCard}
                  formatearFecha={formatearFecha}
                  handleShowDetails={handleShowDetails}
                />
              )
            )}
          </div>
        )}
        
        {/* Mostrar paginación solo si hay más de una página */}
        {!loading && !error && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <OrdenDetailModal
          show={showDetailModal}
          onHide={handleCloseModal}
          orden={selectedOrden}
        />

      </div>
    </>
  );
};

export default Tecnico;