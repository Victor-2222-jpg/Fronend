import { useState, useEffect, useCallback, use } from 'react';
import { OrdenService } from '../../../core/services/Orden/OrdenService.service';
import type { OrdenTrabajoSimplificada } from '../../../core/Models/Ordenes/ordenobtener.interface';

export const useTecnico = () => {
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(15);

  const stateOptions = [
    { value: "todos", label: "Todos" },
    { value: "pendiente", label: "Pendiente" },
    { value: "en proceso", label: "En proceso" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" }
  ];

   const userOptions = [
    { value: "1", label: "Juan Pérez" },
    { value: "2", label: "María García" },
    { value: "3", label: "Pedro Rodríguez" }
  ];
  
  // Estados de filtrado
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  
  // Estados de órdenes
      // Cambia los tipos de los estados
    const [allOrdenes, setAllOrdenes] = useState<OrdenTrabajoSimplificada[]>([]);
    const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenTrabajoSimplificada[]>([]);
    const [ordenes, setOrdenes] = useState<OrdenTrabajoSimplificada[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  // Estados de modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajoSimplificada | null>(null);

  // Instancia del servicio
  const ordenService = new OrdenService();

  // Calcular total de páginas
  const totalPages = Math.ceil((filtrosAplicados ? filteredOrdenes.length : totalItems) / itemsPerPage);

  // Cargar órdenes
  const fetchOrdenes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordenService.obtenerOrdenesTecnico();
      
      // Guardar todas las órdenes
      setAllOrdenes(data);
      setFilteredOrdenes(data);
      
      // Actualizar el total de items para la paginación
      setTotalItems(data.length);
      
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes del técnico:', err);
      setError('No se pudieron cargar las órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);
  
  // Actualizar órdenes mostradas cuando cambia la página o los filtros
  useEffect(() => {
    const ordenesSource = filtrosAplicados ? filteredOrdenes : allOrdenes;
    
    if (ordenesSource.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setOrdenes(ordenesSource.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [currentPage, itemsPerPage, allOrdenes, filteredOrdenes, filtrosAplicados]);

  // Manejadores para la paginación
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prevMode => prevMode === 'table' ? 'cards' : 'table');
  }, []);

  // Manejadores para el modal
  const handleShowDetails = useCallback((orden: OrdenTrabajoSimplificada) => {
  setSelectedOrden(orden);
  setShowDetailModal(true);
}, []);
  
  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedOrden(null);
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
    let filtered = [...allOrdenes];
    
    // Filtrar por estado
    if (estadoFiltro !== 'todos') {
      filtered = filtered.filter(o => o.estado?.toLowerCase() === estadoFiltro.toLowerCase());
    }
    
    // Filtrar por fecha desde
       // Opción 1: Usando aserción de tipo
    if (fechaDesde) {
      const desde = new Date(fechaDesde as string);
      filtered = filtered.filter(o => new Date(o.fecha_inicio) >= desde);
    }
    
    // Filtrar por fecha hasta
    if (fechaHasta) {
      const hasta = new Date(fechaHasta as string);
      hasta.setHours(23, 59, 59); // Final del día
      filtered = filtered.filter(o => new Date(o.fecha_fin) <= hasta);
    }
    
    setFilteredOrdenes(filtered);
    setFiltrosAplicados(true);
    setCurrentPage(1); // Resetear a la primera página
  }, [allOrdenes, estadoFiltro, fechaDesde, fechaHasta]);

  // Función para limpiar filtros
  const handleResetFilters = useCallback(() => {
    setEstadoFiltro('todos');
    setFechaDesde('');
    setFechaHasta('');
    setFiltrosAplicados(false);
    setFilteredOrdenes(allOrdenes);
    setCurrentPage(1);
  }, [allOrdenes]);

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
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }, []);

  // Retornar todo lo que necesita el componente
  return {
    // Estados
    ordenes,
    loading,
    error,
    totalPages,
    currentPage,
    showDetailModal,
    selectedOrden,
    estadoFiltro,
    fechaDesde,
    fechaHasta,
    filtrosAplicados,
    viewMode,
    
    // Manejadores
    handlePageChange,
    handleShowDetails,
    handleCloseModal,
    handleEstadoChange,
    handleFechaDesdeChange,
    handleFechaHastaChange,
    handleApplyFilters,
    handleResetFilters,
    toggleViewMode,
    userOptions,
    stateOptions,
    
    // Utilidades
    getTipoCard,
    formatearFecha,
    
    // Métodos para refrescar datos
    refetchOrdenes: fetchOrdenes
  };
};