import React from 'react';
import './dashboard.css';
import { useTecnico } from './useTecnicoDashboard';
import OrdenesTable from './components/OrdenesTable';
import OrdenesCards from './components/OrdenesCards';
import Pagination from '../../../shared/components/Pagination';

import '../notificacion/dashboard.css'; // Asegúrate de que este archivo CSS esté en la ruta correcta
import OrdenDetailModal from '../../../shared/components/Modals/OrdenDetail/OrdenDetailModal';
import FiltersToolbar from '../../../shared/components/Filtro/FiltersToolbar';
import LlenadoOrden from '../../../shared/components/LlenadoOrden/LlenadoOrden';
import OrdenHistorialModal from '../../../shared/components/OrdenHistorial/OrdenHistorial';

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

     showSeguimientoModal,
    selectedOrdenSeguimiento,
    tecnicos,
    loadingTecnicos,
    handleShowSeguimiento,
    handleCloseSeguimientoModal,
    handleConfirmSeguimiento,
    showHistorialModal,
    selectedOrdenHistorial,
    handleShowHistorial,
    handleCloseHistorialModal,

    
    handleApplyFilters,
    handleResetFilters,
    getTipoCard,
    userOptions,
    stateOptions,
    formatearFecha,
    estadoFiltro,
    filtrosAplicados,
    viewMode,
    toggleViewMode
  } = useTecnico();

  return (
    <>
      <div className="dashboard-container" style={{ paddingTop: '90px' }}>
         <FiltersToolbar
          // Usuario (opcional)
          showUserFilter={false}
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
          onViewModeChange={toggleViewMode} onStateFilterChange={function (): void {
            throw new Error('Function not implemented.');
          } } dateFromValue={''} onDateFromChange={function (): void {
            throw new Error('Function not implemented.');
          } } dateToValue={''} onDateToChange={function (): void {
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
            handleShowSeguimiento={handleShowSeguimiento}
            handleShowHistorial={handleShowHistorial} // NUEVA PROP
          />
              ) : (
            <OrdenesCards
            ordenes={ordenes}
            getTipoCard={getTipoCard}
            formatearFecha={formatearFecha}
            handleShowDetails={handleShowDetails}
            handleShowSeguimiento={handleShowSeguimiento}
            handleShowHistorial={handleShowHistorial} // NUEVA PROP
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

         <LlenadoOrden
          show={showSeguimientoModal}
          onHide={handleCloseSeguimientoModal}
          onConfirm={handleConfirmSeguimiento}
          tecnicos={tecnicos}
          tecnicoInicial={selectedOrdenSeguimiento?.tecnico_responsable ? {
            id: selectedOrdenSeguimiento.tecnico_responsable.id,
            nombre: selectedOrdenSeguimiento.tecnico_responsable.nombre,
            numero_Telefono: selectedOrdenSeguimiento.tecnico_responsable.numero_Telefono || ''
          } : undefined}
          fechaInicialInicio={selectedOrdenSeguimiento?.fecha_inicio}
          fechaInicialFin={selectedOrdenSeguimiento?.fecha_fin}
          loading={loadingTecnicos}
          ordenId={selectedOrdenSeguimiento?.id }
          
        />

        <OrdenHistorialModal
          show={showHistorialModal}
          onHide={handleCloseHistorialModal}
          ordenId={selectedOrdenHistorial?.id}
        />

      </div>
    </>
  );
};

export default Tecnico;