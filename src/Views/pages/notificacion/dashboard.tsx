import React from 'react';
import './dashboard.css';
import { NotificationDetailModal } from '../../../shared/components/Modals';
import Pagination from '../../../shared/components/Pagination';
import { useNotificacionDashboard } from './useNotificacionDashboard';
import NotificacionesTable from './components/NotificacionesTable';
import NotificacionesCards from './components/NotificacionesCards'; // Puedes instalar react-icons si no está ya
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
    toggleViewMode,
    getTipoCard,
    formatearFecha,    // Opciones de estado
    userOptions,      // Opciones de usuario
    viewMode,        // Nuevo estado
    userFilterValue, // Valor del filtro de usuario
    handleUserFilterChange, // Nueva función
      // Nueva función
  } = useNotificacionDashboard();

  return (
    <>
      <div className="dashboard-container" style={{ paddingTop: '90px' }}>
       <FiltersToolbar
          // Usuario (implementado como buscador)
          showUserFilter={false}
          userOptions={userOptions}
          userFilterValue={userFilterValue}
          onUserFilterChange={handleUserFilterChange} stateOptions={[]} stateFilterValue={''} onStateFilterChange={function (): void {
            throw new Error('Function not implemented.');
          } } dateFromValue={''} onDateFromChange={function (): void {
            throw new Error('Function not implemented.');
          } } dateToValue={''} onDateToChange={function (): void {
            throw new Error('Function not implemented.');
          } } onApplyFilters={function (): void {
            throw new Error('Function not implemented.');
          } } onResetFilters={function (): void {
            throw new Error('Function not implemented.');
          } } filtersApplied={false}   
          
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={toggleViewMode}
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
          notificacion={
            selectedNotificacion
              ? { 
                  ...selectedNotificacion, 
                  usuarioCreador: {
                    id: selectedNotificacion.usuarioCreador?.id || 0,
                    Nombre: selectedNotificacion.usuarioCreador?.Nombre || '',
                    Apellido_Paterno: selectedNotificacion.usuarioCreador?.Apellido_Paterno || '',
                    Apellido_Materno: selectedNotificacion.usuarioCreador?.Apellido_Materno || '',
                    email: selectedNotificacion.usuarioCreador?.email || ''
                  },
                  ClaseDepartamentoSubsidiaria: {
                    id: selectedNotificacion.ClaseDepartamentoSubsidiaria?.id || 0,
                    subsidiaria: {
                      id: selectedNotificacion.ClaseDepartamentoSubsidiaria?.subsidiaria?.id || 0,
                      nombre: selectedNotificacion.ClaseDepartamentoSubsidiaria?.subsidiaria?.nombre || 'Sin subsidiaria'
                    },
                    departamento: {
                      id: selectedNotificacion.ClaseDepartamentoSubsidiaria?.departamento?.id || 0,
                      nombre: selectedNotificacion.ClaseDepartamentoSubsidiaria?.departamento?.nombre || 'Sin departamento'
                    },
                    clase: {
                      id: selectedNotificacion.ClaseDepartamentoSubsidiaria?.clase?.id || 0,
                      nombre: selectedNotificacion.ClaseDepartamentoSubsidiaria?.clase?.nombre || 'Sin clase',
                      descripcion: selectedNotificacion.ClaseDepartamentoSubsidiaria?.clase?.descripcion || 'Sin descripción',
                      ubicacion: selectedNotificacion.ClaseDepartamentoSubsidiaria?.clase?.ubicacion || 'Sin ubicación'
                    }
                  },
                  // Otras propiedades...
                }
              : null
          }
        />
      </div>
    </>
  );
};

export default ClienteDashboard;