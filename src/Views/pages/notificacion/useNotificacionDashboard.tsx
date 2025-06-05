import { useState, useEffect, useCallback, type SetStateAction } from 'react';
import NotificacionesService from '../../../core/services/Notificaciones/Notificaciones.service';
import type { NotificacionCompleta } from '../../../core/Models/Notificaciones/notinueva.interface';
import FiltrosService from '../../../core/services/Filtros/Filtros.service';

export const useNotificacionDashboard = () => {
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);

   const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [userFilterValue, setUserFilterValue] = useState('');

  const stateOptions = [
    { value: "todos", label: "Todos" },
    { value: "pendiente", label: "Pendiente" },
    { value: "en proceso", label: "En proceso" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" }
  ];

  // Ejemplo de opciones de usuarios (estos deberían venir de tu estado)
  
  
  // Estados de filtrado
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  
  // Estados de notificaciones
  const [allNotificaciones, setAllNotificaciones] = useState<NotificacionCompleta[]>([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState<NotificacionCompleta[]>([]);
  const [notificaciones, setNotificaciones] = useState<NotificacionCompleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  // Estados de modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState<NotificacionCompleta | null>(null);

  // Calcular total de páginas
  const totalPages = Math.ceil((filtrosAplicados ? filteredNotificaciones.length : totalItems) / itemsPerPage);

  // Cargar notificaciones
  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificacionesService.obtenerNotificaciones();
      
      // Guardar todas las notificaciones
      setAllNotificaciones(data);
      setFilteredNotificaciones(data);
      
      // Actualizar el total de items para la paginación
      setTotalItems(data.length);
      
      setError(null);
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);
  
  // Actualizar notificaciones mostradas cuando cambia la página o los filtros
  useEffect(() => {
    const notificacionesSource = filtrosAplicados ? filteredNotificaciones : allNotificaciones;
    
    if (notificacionesSource.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setNotificaciones(notificacionesSource.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [currentPage, itemsPerPage, allNotificaciones, filteredNotificaciones, filtrosAplicados]);

  useEffect(() => {
      // Función para cargar los datos de los usuarios
      const fetchUsers = async () => {
        try {
          // Aquí iría la llamada al API cuando esté disponible
           const response = await FiltrosService.obtenerUsuarios();
          console.log('Usuarios cargados:', response);
           setUserOptions(response.map(user => ({
           value: user.id.toString(),
            label: `${user.Nombre} ${user.Apellido_Paterno} ${user.Apellido_Materno}`
          })));
          
          // Por ahora, usar datos dummy:
          
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
        }
      };
      
      fetchUsers();
    }, []);
  // Manejadores para la paginación
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prevMode => prevMode === 'table' ? 'cards' : 'table');
  }, []);

  // Manejadores para el modal
  const handleShowDetails = useCallback((notificacion: NotificacionCompleta) => {
    setSelectedNotificacion(notificacion);
    setShowDetailModal(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedNotificacion(null);
  }, []);

  // Manejadores para filtros
  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoFiltro(e.target.value);
  }, []);

  const handleFechaDesdeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(e.target.value);
  }, []);

  const handleFechaHastaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(e.target.value);
  }, []);

  const handleApplyFilters = useCallback(() => {
    let filtered = [...allNotificaciones];
    
    // Filtrar por estado
    if (estadoFiltro !== 'todos') {
      filtered = filtered.filter(n => n.estado_notificacion.toLowerCase() === estadoFiltro.toLowerCase());
    }
    
    // Filtrar por fecha desde
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      filtered = filtered.filter(n => new Date(n.fecha_notificacion) >= desde);
    }
    
    // Filtrar por fecha hasta
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59); // Final del día
      filtered = filtered.filter(n => new Date(n.fecha_notificacion) <= hasta);
    }
    
    setFilteredNotificaciones(filtered);
    setFiltrosAplicados(true);
    setCurrentPage(1); // Resetear a la primera página
  }, [allNotificaciones, estadoFiltro, fechaDesde, fechaHasta]);

  // Función para limpiar filtros
  const handleResetFilters = useCallback(() => {
    setEstadoFiltro('todos');
    setFechaDesde('');
    setFechaHasta('');
    setFiltrosAplicados(false);
    setFilteredNotificaciones(allNotificaciones);
    setCurrentPage(1);
  }, [allNotificaciones]);

  // Funciones de utilidad
  const getTipoCard = useCallback((estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return 'success';
      case 'cancelada':
        return 'error';
      case 'en revisión':
      case 'en revisión':
        return 'warning';
      case 'en proceso':
        return 'info';
      default:
        return 'success';
    }
  }, []);

  const formatearFecha = useCallback((fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }, []);

  const handleUserFilterChange = (value: SetStateAction<string>) => {
    setUserFilterValue(value);
    // Aquí puedes hacer lo que necesites con el valor seleccionado
  };

  // Transformar notificación para el modal
  

  // Retornar todo lo que necesita el componente
  return {
    // Estados
    notificaciones,
    loading,
    error,
    totalPages,
    currentPage,
    showDetailModal,
    selectedNotificacion,
    estadoFiltro,
    fechaDesde,
    fechaHasta,
    filtrosAplicados,
    
    
    // Manejadores
    handlePageChange,
    handleShowDetails,
    handleCloseModal,
    handleEstadoChange,
    handleFechaDesdeChange,
    handleFechaHastaChange,
    handleApplyFilters,
    handleResetFilters,
    
    // Utilidades
    getTipoCard,
    toggleViewMode,
    viewMode,
    formatearFecha,
    stateOptions,
    userFilterValue,
    handleUserFilterChange,
    userOptions,
    
    
    // Métodos para refrescar datos
    refetchNotificaciones: fetchNotificaciones
  };
};