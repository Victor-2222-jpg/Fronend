import React from 'react';
import { NotificationDetailModal } from '../../../../shared/components/Modals';
import EstadoNotificacionModal from '../../../../shared/components/Modals/EstadoNotificacion';
import './dashboard.css';
import Pagination from '../../../../shared/components/Pagination';
import { useDashboard } from './useDashboard';
import NotificacionesTable from './components/NotificacionesTable';
import NotificacionesCards from './components/NotificacionesCards';
// Importar íconos (puedes usar react-icons o bootstrap-icons)
import NuevaObservacionModal from '../../../../shared/components/Modals/EditarModal';
import FiltersToolbar from '../../../../shared/components/Filtro/FiltersToolbar';

const GerenteDashboard: React.FC = () => {
  const {
    notificaciones,
    loading,
    error,
    showEstadoModal,
    selectedNotificacionAccion,
    accionActual,
    showDetailModal,
    selectedNotificacion,
    showEditarModal,            // Nuevo estado
    selectedNotificacionEditar,
    handleShowDetails,
    handleCloseModal,
    handleOpenAceptarModal,
    handleOpenRechazarModal,
    handleCloseEstadoModal,
    handleOpenEditarModal,      // Nueva función
    handleCloseEditarModal,     // Nueva función
    handleConfirmEstado,
    handleAddComment,
    getTipoCard,
    formatearFecha,
    currentPage,
    totalPages,
    handlePageChange,
    viewMode,       // Nuevo estado
    tecnicos,  // Opciones de estado
    userOptions,   // Opciones de usuario
    usuarioActual,
    userFilterValue,
    toggleViewMode, // Nueva función
    handleUserFilterChange, // Nueva función
    loadingTecnicos  // Nueva función
  } = useDashboard();

  return (
    <>
      <div className="dashboard-container" style={{ paddingTop: '90px' }}>
        <FiltersToolbar
          // Usuario (implementado como buscador)
          showUserFilter={true}
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
                  handleOpenAceptarModal={handleOpenAceptarModal}
                  handleOpenRechazarModal={handleOpenRechazarModal}
                  handleOpenEditarModal={handleOpenEditarModal}
                />
              ) : (
                <NotificacionesCards
                  notificaciones={notificaciones}
                  getTipoCard={getTipoCard}
                  formatearFecha={formatearFecha}
                  handleShowDetails={handleShowDetails}
                  handleOpenAceptarModal={handleOpenAceptarModal}
                  handleOpenRechazarModal={handleOpenRechazarModal}
                  handleOpenEditarModal={handleOpenEditarModal}
                />
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

      <EstadoNotificacionModal
        show={showEstadoModal}
        onHide={handleCloseEstadoModal}
        notificacion={selectedNotificacionAccion}
        accion={accionActual}
        onConfirm={handleConfirmEstado}
      />
        <NuevaObservacionModal
        show={showEditarModal}
        onHide={handleCloseEditarModal}
        notificacion={selectedNotificacionEditar}
        onGuardar={handleAddComment}
        tecnicos={tecnicos} // Pasar los técnicos
        loadingTecnicos={loadingTecnicos} // Pasar el estado de carga
        usuarioLogueado={usuarioActual}
      />
    </>
  );
};

export default GerenteDashboard;