import { useState, useEffect, useCallback, useRef } from 'react';
import { OrdenService } from '../../../../core/services/Orden/OrdenService.service';
import type { OrdenTrabajo } from '../../../../core/Models/Ordenes/orden.interface';
import type { Tecnico } from '../../../../core/Models/Ordenes/Tecnico.interface'; 

export const useDashboardOrden = () => {
  // Estados para los datos - CAMBIO PRINCIPAL
  const [allOrdenes, setAllOrdenes] = useState<OrdenTrabajo[]>([]); // ✅ Todas las órdenes
  const [ordenesPaginadas, setOrdenesPaginadas] = useState<OrdenTrabajo[]>([]); // ✅ Órdenes paginadas
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginación - IGUAL QUE EN useDashboard
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(15); // Cambiado de variable a constante
  
  // Estados para modales (sin cambios)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showEstadoModal, setShowEstadoModal] = useState<boolean>(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState<boolean>(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [selectedOrdenAccion, setSelectedOrdenAccion] = useState<OrdenTrabajo | null>(null);
  const [accionActual, setAccionActual] = useState<'aprobar' | 'rechazar'>('aprobar');

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState<boolean>(false);

  // Calcular páginas totales - IGUAL QUE EN useDashboard
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const ordenService = new OrdenService();

  // ✅ CARGAR ÓRDENES - MISMA LÓGICA QUE fetchNotificaciones
  const fetchOrdenes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordenService.obtenerOrdenes();
      
      console.log('Response completa:', response);
      
      // Si response es un array, tomar el primer elemento
      const apiResponse = Array.isArray(response) ? response[0] : response;
      // Extraer el array de órdenes de la propiedad 'ordenesTrabajo'
      const ordenesArray = apiResponse?.ordenesTrabajo || [];
      
      console.log('Órdenes extraídas:', ordenesArray);
      console.log('Cantidad total de órdenes:', ordenesArray.length);
      
      // ✅ GUARDAR TODAS LAS ÓRDENES Y ACTUALIZAR totalItems
      setAllOrdenes(Array.isArray(ordenesArray) ? ordenesArray : []);
      setTotalItems(ordenesArray.length);
      
      console.log(`Cargadas ${ordenesArray.length} órdenes`);
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes:', err);
      setError('Error al cargar las órdenes de trabajo. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ACTUALIZAR ÓRDENES PAGINADAS - MISMA LÓGICA QUE EN useDashboard
  useEffect(() => {
    if (allOrdenes.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, allOrdenes.length);
      
      const paginatedResults = allOrdenes.slice(startIndex, endIndex);
      setOrdenesPaginadas(paginatedResults);
      
      console.log(`Página ${currentPage}: Mostrando ${startIndex + 1}-${endIndex} de ${allOrdenes.length}`);
    } else {
      setOrdenesPaginadas([]);
    }
  }, [allOrdenes, currentPage, itemsPerPage]);

  // ✅ CARGAR ÓRDENES AL MONTAR - MISMA LÓGICA QUE EN useDashboard
  const mountedRef = useRef(false);

  useEffect(() => {
    // Solo ejecutar si no se ha montado anteriormente
    if (!mountedRef.current) {
      fetchOrdenes();
      mountedRef.current = true;
    }
  }, [fetchOrdenes]);

  // ✅ MANEJAR CAMBIO DE PÁGINA - IGUAL QUE EN useDashboard
  const handlePageChange = useCallback((newPage: number) => {
    console.log(`Cambiando a página ${newPage}`);
    setCurrentPage(newPage);
  }, []);

  const fetchTecnicos = useCallback(async () => {
    try {
      setLoadingTecnicos(true);
      const data = await ordenService.obtenerTecnicos();
      setTecnicos(Array.isArray(data) ? data : []);
      setLoadingTecnicos(false);
    } catch (err) {
      console.error('Error al cargar técnicos:', err);
      setTecnicos([]);
      setLoadingTecnicos(false);
    }
  }, []);

  // Formatear fecha
  const formatearFecha = useCallback((fechaStr: string) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Obtener clase CSS basada en estado
  const getTipoCard = useCallback((estado: string) => { 
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

  // Manejadores para modales
  const handleShowDetails = useCallback((orden: OrdenTrabajo) => {
    setSelectedOrden(orden);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedOrden(null);
  }, []);

  const handleCloseAsignacionModal = useCallback(() => {
    setShowAsignacionModal(false);
    setSelectedOrdenAccion(null);
  }, []);

  const handleOpenAprobarModal = useCallback((orden: OrdenTrabajo) => {
    setSelectedOrdenAccion(orden);
    
    if (orden.estado === 'PreAprobada') {
      // Si es PreAprobada, cargar técnicos y mostrar modal de asignación
      setLoadingTecnicos(true);
      fetchTecnicos()
        .then(() => {
          setShowAsignacionModal(true);
        })
        .catch(() => {
          alert('Error al cargar la lista de técnicos');
        })
        .finally(() => {
          setLoadingTecnicos(false);
        });
    } else {
      // Para otros estados, mostrar el modal de cambio de estado
      setAccionActual('aprobar');
      setShowEstadoModal(true);
    }
  }, [fetchTecnicos]);

  const handleOpenRechazarModal = useCallback((orden: OrdenTrabajo) => {
    setSelectedOrdenAccion(orden);
    setAccionActual('rechazar');
    setShowEstadoModal(true);
  }, []);

  const handleCloseEstadoModal = useCallback(() => {
    setShowEstadoModal(false);
    setSelectedOrdenAccion(null);
  }, []);

  const handleConfirmEstado = useCallback(async (id: number, nuevoEstado: string, observaciones: string | null) => {
    try {
      console.log(`Cambiando estado de orden ${id} a ${nuevoEstado}`);
      console.log(`Observaciones: ${observaciones || 'Ninguna'}`);
      
      // Aquí iría la lógica para cambiar el estado de la orden
      await ordenService.obtenerOrdenesTecnico();
      
      // ✅ ACTUALIZAR TODAS LAS ÓRDENES, NO SOLO LAS PAGINADAS
      setAllOrdenes(prevOrdenes => 
        prevOrdenes.map(orden => 
          orden.id === id 
            ? { ...orden, estado: nuevoEstado } 
            : orden
        )
      );
      
      // Cerrar modal
      handleCloseEstadoModal();
      
      // Mensaje de éxito
      alert(`Orden de trabajo ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} con éxito`);
      
    } catch (error) {
      console.error('Error al cambiar estado de la orden:', error);
      alert('Ocurrió un error al procesar la solicitud');
    }
  }, [handleCloseEstadoModal]);

  const handleConfirmAsignacion = useCallback((
    ordenId: number,
    tecnicoId: number,
    fechaInicio: string,
    fechaFin: string
  ) => {
    try {
      console.log(`Asignando técnico ${tecnicoId} a la orden ${ordenId}`);
      console.log(`Fechas: ${fechaInicio} - ${fechaFin}`);
      
      // ✅ ACTUALIZAR TODAS LAS ÓRDENES, NO SOLO LAS PAGINADAS
      setAllOrdenes(prevOrdenes => 
        prevOrdenes.map(orden => 
          orden.id === ordenId 
            ? { 
                ...orden, 
                estado: 'En Proceso',
                tecnico_id: tecnicoId,
                tecnico: {
                  id: tecnicoId,
                  nombre: tecnicos.find(t => t.id === tecnicoId)?.nombre || '',
                  numero_Telefono: tecnicos.find(t => t.id === tecnicoId)?.numero_Telefono || '',
                },
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
              } 
            : orden
        )
      );
      
      // Cerrar modal
      handleCloseAsignacionModal();
      
      // Mensaje de éxito
      alert('Técnico asignado correctamente');
      
    } catch (error) {
      console.error('Error al asignar técnico:', error);
      alert('Ocurrió un error al asignar el técnico');
    }
  }, [tecnicos, handleCloseAsignacionModal]);

  // ✅ RETORNAR LAS ÓRDENES PAGINADAS Y TOTALITEMS
  return {
    ordenes: ordenesPaginadas, // ✅ Ahora devolvemos las órdenes paginadas
    loading,
    error,
    showEstadoModal,
    selectedOrdenAccion,
    accionActual,
    showDetailModal,
    selectedOrden,
    handleShowDetails,
    handleCloseModal,
    handleOpenAprobarModal,
    handleOpenRechazarModal,
    handleCloseEstadoModal,
    handleConfirmEstado,
    getTipoCard,
    formatearFecha,
    currentPage,
    totalPages, // ✅ Calculado correctamente desde totalItems
    totalItems, // ✅ Agregar totalItems
    tecnicos,
    showAsignacionModal,
    loadingTecnicos,
    stateOptions,
    userOptions,
    handleCloseAsignacionModal,
    handleConfirmAsignacion,
    handlePageChange,
    
    // ✅ AGREGAR MÉTODO PARA REFRESCAR DATOS
    refetchOrdenes: fetchOrdenes
  };
};