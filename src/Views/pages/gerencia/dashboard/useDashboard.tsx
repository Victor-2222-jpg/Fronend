import { useState, useEffect, useCallback, useRef, type SetStateAction } from 'react';
import NotificacionesService from '../../../../core/services/Notificaciones/Notificaciones.service';
import type { NotificacionCompleta } from '../../../../core/Models/Notificaciones/notinueva.interface';
import type { Tecnico } from '../../../../core/Models/Ordenes/Tecnico.interface';
import { OrdenService } from '../../../../core/services/Orden/OrdenService.service';
import TokenService from '../../../../core/services/token/token.service';
import FiltrosService from '../../../../core/services/Filtros/Filtros.service';

export const useDashboard = () => {
  // Estados para los datos
  const [allNotificaciones, setAllNotificaciones] = useState<NotificacionCompleta[]>([]);
  const [notificacionesPaginadas, setNotificacionesPaginadas] = useState<NotificacionCompleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showEditarModal, setShowEditarModal] = useState<boolean>(false);
const [selectedNotificacionEditar, setSelectedNotificacionEditar] = useState<NotificacionCompleta | null>(null);
const [usuarioActual, setUsuarioActual] = useState<{ id: number }>({ id: 1 });
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(15);

 
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
 
  

  // Estados para modales
  const [showEstadoModal, setShowEstadoModal] = useState<boolean>(false);
  const [selectedNotificacionAccion, setSelectedNotificacionAccion] = useState<NotificacionCompleta | null>(null);
  const [accionActual, setAccionActual] = useState<'aceptar' | 'cancelar'>('aceptar');

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState<NotificacionCompleta | null>(null);

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState<boolean>(false);

  // Calcular páginas totales
  const totalPages = Math.ceil(totalItems / itemsPerPage);
   const ordenService = new OrdenService();

  // Cargar notificaciones
  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificacionesService.obtenerNotificacionesGerencia();
      
      // Guardar todas las notificaciones y actualizar totalItems
      setAllNotificaciones(data);
      setTotalItems(data.length);
      
      console.log(`Cargadas ${data.length} notificaciones`);
      setError(null);
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar notificaciones paginadas cuando cambia la página o las notificaciones totales
  useEffect(() => {
    if (allNotificaciones.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, allNotificaciones.length);
      
      const paginatedResults = allNotificaciones.slice(startIndex, endIndex);
      setNotificacionesPaginadas(paginatedResults);
      
      console.log(`Página ${currentPage}: Mostrando ${startIndex + 1}-${endIndex} de ${allNotificaciones.length}`);
    } else {
      setNotificacionesPaginadas([]);
    }
  }, [allNotificaciones, currentPage, itemsPerPage]);

  useEffect(() => {
    // Obtener ID del usuario autenticado
    const decodedToken = TokenService.decodeToken();
    if (decodedToken) {
      const userId = parseInt(decodedToken.id || decodedToken.id || '1');
      console
      console.log('ID de usuario autenticado siiiiiiiiiiiii:', userId);
      setUsuarioActual({ id: userId });
      console.log('Usuario autenticado ID:', userId);
    }
  }, []);


  // Efecto para cargar notificaciones al montar el componente
  const mountedRef = useRef(false);

useEffect(() => {
  // Solo ejecutar si no se ha montado anteriormente
  if (!mountedRef.current) {
    fetchNotificaciones();
    mountedRef.current = true;
  }
}, [fetchNotificaciones]);

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

  // Manejar cambio de página
  const handlePageChange = useCallback((newPage: number) => {
    console.log(`Cambiando a página ${newPage}`);
    setCurrentPage(newPage);
  }, []);

  // Manejadores para modales
  const handleShowDetails = useCallback((notificacion: NotificacionCompleta) => {
    setSelectedNotificacion(notificacion);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedNotificacion(null);
  }, []);

  const handleOpenAceptarModal = useCallback((notificacion: NotificacionCompleta) => {
    setSelectedNotificacionAccion(notificacion);
    setAccionActual('aceptar');
    setShowEstadoModal(true);
  }, []);

  const handleOpenRechazarModal = useCallback((notificacion: NotificacionCompleta) => {
    setSelectedNotificacionAccion(notificacion);
    setAccionActual('cancelar');
    setShowEstadoModal(true);
  }, []);

  const fetchTecnicos = useCallback(async () => {
    try {
      setLoadingTecnicos(true);
      const data = await ordenService.obtenerTecnicos();
      setTecnicos(Array.isArray(data) ? data : []);
      console.log('Técnicos cargados:', data);
      return data;
    } catch (err) {
      console.error('Error al cargar técnicos:', err);
      setTecnicos([]);
      throw err;
    } finally {
      setLoadingTecnicos(false);
    }
  }, []);

  const handleOpenEditarModal = useCallback((notificacion: NotificacionCompleta) => {
  setSelectedNotificacionEditar(notificacion);
  fetchTecnicos().catch(() => {
      console.error('No se pudieron cargar los técnicos');
    });
  setShowEditarModal(true);
}, [fetchTecnicos]);

const handleCloseEditarModal = useCallback(() => {
  setShowEditarModal(false);
  setSelectedNotificacionEditar(null);
}, []);


  const handleCloseEstadoModal = useCallback(() => {
    setShowEstadoModal(false);
    setSelectedNotificacionAccion(null);
  }, []);

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

const toggleViewMode = useCallback(() => {
  setViewMode(prevMode => prevMode === 'table' ? 'cards' : 'table');
}, []);


  const formatearFecha = useCallback((fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }, []);

  const handleConfirmEstado = useCallback(async (id: number, nuevoEstado: string, observaciones: string | null) => {
    try {
      // Aquí implementar la lógica real para cambiar estado
      console.log(`Cambiando estado de ${id} a ${nuevoEstado}`);
      console.log(`Observaciones: ${observaciones || 'Ninguna'}`);

      const notificacionData = {
      comentario: observaciones,
      notificacion_id: id,
      estado: nuevoEstado
    };
    await NotificacionesService.EnviarNotificacion(notificacionData);
      
      // Llamada a API (comentada para ejemplo)
      // await NotificacionesService.cambiarEstadoNotificacion(id, nuevoEstado, observaciones);
      
      // Actualizar estado local
      setAllNotificaciones(prevNotificaciones => 
        prevNotificaciones.map(notif => 
          notif.id === id 
            ? { ...notif, estado_notificacion: nuevoEstado } 
            : notif
        )
      );

      fetchNotificaciones();
      
      // Cerrar modal
      handleCloseEstadoModal();
      
      // Opcional: mostrar mensaje de éxito
      alert(`Notificación ${nuevoEstado === 'aceptada' ? 'aceptada' : 'cancelada'} con éxito`);
      
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Ocurrió un error al procesar la solicitud');
    }
  }, [handleCloseEstadoModal]);


    const handleAddComment = useCallback(async (id: number, observaciones: string, nuevoEstado: string | null = null) => {
    try {
      // Log para depuración
      console.log(`Añadiendo comentario a notificación ${id}`);
      console.log(`Observaciones: ${observaciones || 'Ninguna'}`);
      if (nuevoEstado) {
        console.log(`Cambiando estado a: ${nuevoEstado}`);
      } else {
        console.log('No se cambiará el estado');
      }
  
      // Preparar datos para la API
      const notificacionData = {
        comentario: observaciones,
        notificacion_id: id,
        estado: nuevoEstado || null// Si es null o undefined, no se enviará un nuevo estado
      };
      
      // Llamada a la API
      await NotificacionesService.EnviarNotificacion(notificacionData);
      
      // Actualizar estado local solo si se proporciona un nuevo estado
      if (nuevoEstado) {
        setAllNotificaciones(prevNotificaciones => 
          prevNotificaciones.map(notif => 
            notif.id === id 
              ? { ...notif, estado_notificacion: nuevoEstado } 
              : notif
          )
        );
      }
  
      // Refrescar notificaciones para obtener los datos actualizados
      fetchNotificaciones();
      
      // Opcional: cerrar algún modal si es necesario
      // Por ejemplo, podríamos agregar un parámetro para una función de cierre
      
      // Mostrar mensaje de éxito
      alert('Comentario añadido con éxito');
      
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      alert('Ocurrió un error al procesar la solicitud');
    }
  }, [fetchNotificaciones]);

  
  
  // (Eliminado: declaración duplicada de toggleViewMode)
  
  
  const handleUserFilterChange = (value: SetStateAction<string>) => {
    setUserFilterValue(value);
    // Aquí puedes hacer lo que necesites con el valor seleccionado
  };

  

  

  

  const handleGuardarObservacion = useCallback(async (id: number, observacion: string) => {
  try {
    console.log(`Guardando observación para notificación ${id}: ${observacion}`);
    // Aquí iría la llamada a la API para guardar la observación
    // await NotificacionesService.guardarObservacion(id, observacion);
    
    // Opcional: actualizar datos locales si es necesario
    return Promise.resolve();
  } catch (error) {
    console.error('Error al guardar observación:', error);
    return Promise.reject(error);
  }
}, []);

  // Retornar todo lo que necesita el componente
  return {
    // Estados
    notificaciones: notificacionesPaginadas, // Ahora devolvemos las notificaciones paginadas
    loading,
    error,
    showEstadoModal,
    selectedNotificacionAccion,
    accionActual,
    showDetailModal,
    showEditarModal,
    selectedNotificacionEditar,
    selectedNotificacion,
    currentPage,
    totalPages,
    totalItems,
    viewMode,
    toggleViewMode, // Importante: añadir esta propiedad para debuggear
    
    // Manejadores
    handleShowDetails,
    handleCloseModal,
    handleOpenAceptarModal,
    handleOpenRechazarModal,
    handleCloseEstadoModal,
    handleConfirmEstado,
    handleOpenEditarModal,
  handleCloseEditarModal,
  handleGuardarObservacion,
    handleAddComment,
    loadingTecnicos,
    tecnicos,
    handlePageChange,
    
    // Utilidades
    getTipoCard,
    formatearFecha,
    usuarioActual,
    stateOptions,
    userFilterValue,
    userOptions,
    handleUserFilterChange,
    
    // Métodos para refrescar datos
    refetchNotificaciones: fetchNotificaciones
  };
};

function setFiltrosAplicados(arg0: boolean) {
  throw new Error('Function not implemented.');
}
