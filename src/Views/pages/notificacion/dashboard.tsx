import React from 'react';
import './dashboard.css';
import { NotificationDetailModal } from '../../../shared/components/Modals';
import Pagination from '../../../shared/components/Pagination';
import { useNotificacionDashboard } from './useNotificacionDashboard';
import NotificacionesTable from './components/NotificacionesTable';
import NotificacionesCards from './components/NotificacionesCards';
import { BsTable, BsGrid } from 'react-icons/bs'; // Puedes instalar react-icons si no está ya
import FiltersToolbar from '../../../shared/components/Filtro/FiltersToolbar';

const ClienteDashboard: React.FC = () => {
  const {
    notificaciones,
    loading,
    error,
    showDetailModal,
    selectedNotificacion,
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
    formatearFecha,
    estadoFiltro, 
    fechaDesde,  
    fechaHasta,   
    filtrosAplicados,
    stateOptions,     // Opciones de estado
    userOptions,      // Opciones de usuario
    viewMode,        // Nuevo estado
    userFilterValue, // Valor del filtro de usuario
    handleUserFilterChange, // Nueva función
    toggleViewMode   // Nueva función
  } = useNotificacionDashboard();

  return (
    <>
      <div className="dashboard-container" style={{ paddingTop: '90px' }}>
       <FiltersToolbar
          // Usuario (implementado como buscador)
          showUserFilter={true}
          userOptions={userOptions}
          userFilterValue={userFilterValue}
          onUserFilterChange={handleUserFilterChange} stateOptions={[]} stateFilterValue={''} onStateFilterChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateFromValue={''} onDateFromChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } dateToValue={''} onDateToChange={function (value: string): void {
            throw new Error('Function not implemented.');
          } } onApplyFilters={function (): void {
            throw new Error('Function not implemented.');
          } } onResetFilters={function (): void {
            throw new Error('Function not implemented.');
          } } filtersApplied={false}        
        // ... otras props
      />

        {loading ? (
          <div className="loading-message">Cargando notificaciones...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className={viewMode === 'table' ? 'table-container' : 'cards-view-container'}>
            {notificaciones.length === 0 ? (
              <div className="empty-message">No hay notificaciones disponibles</div>
            ) : (
              viewMode === 'table' ? (
                <NotificacionesTable 
                  notificaciones={notificaciones}
                  getTipoCard={getTipoCard}
                  formatearFecha={formatearFecha}
                  handleShowDetails={handleShowDetails}
                />
              ) : (
                <NotificacionesCards
                  notificaciones={notificaciones}
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
        
        <NotificationDetailModal 
          show={showDetailModal}
          onHide={handleCloseModal}
          notificacion={selectedNotificacion}
        />
      </div>
    </>
  );
};

export default ClienteDashboard;