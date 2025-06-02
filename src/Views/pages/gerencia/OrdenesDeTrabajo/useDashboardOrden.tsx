import { useState, useEffect, useCallback } from 'react';
import { OrdenService } from '../../../../core/services/Orden/OrdenService.service';
import type { OrdenTrabajo } from '../../../../core/Models/Ordenes/orden.interface';
import type { Tecnico } from '../../../../core/Models/Ordenes/Tecnico.interface'; 


export const useDashboardOrden = () => {
  // Estados
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;
  
  // Estados para modales
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showEstadoModal, setShowEstadoModal] = useState<boolean>(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState<boolean>(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [selectedOrdenAccion, setSelectedOrdenAccion] = useState<OrdenTrabajo | null>(null);
  const [accionActual, setAccionActual] = useState<'aprobar' | 'rechazar'>('aprobar');

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState<boolean>(false);

  const stateOptions = [
    { value: "todos", label: "Todos" },
    { value: "pendiente", label: "Pendiente" },
    { value: "en proceso", label: "En proceso" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" }
  ];

  // Ejemplo de opciones de usuarios (estos deberían venir de tu estado)
  const userOptions = [
    { value: "1", label: "Juan Pérez" },
    { value: "2", label: "María García" },
    { value: "3", label: "Pedro Rodríguez" }
  ];

  
  const ordenService = new OrdenService();

  // Cargar órdenes
       const fetchOrdenes = useCallback(async () => {
      try {
        setLoading(true);
        const response = await ordenService.obtenerOrdenes();
        
        // Extraer directamente ordenesTrabajo del objeto response
        const ordenesArray = response.ordenesTrabajo || [];
        
        console.log('Órdenes recibidas:', ordenesArray);
        
        // Asegúrate de que ordenes siempre sea un array
        setOrdenes(Array.isArray(ordenesArray) ? ordenesArray : []);
        setTotalPages(Math.ceil(ordenesArray.length / itemsPerPage));
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las órdenes de trabajo. Por favor, intente más tarde.');
        setLoading(false);
        console.error('Error fetching ordenes:', err);
      }
    }, [itemsPerPage]);

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

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  // Cambiar página
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
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
      
      // Actualizar localmente para reflejar el cambio
      setOrdenes(prevOrdenes => 
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
    
    // Actualizar localmente para reflejar el cambio
    setOrdenes(prevOrdenes => 
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
                // agrega otras propiedades requeridas por la interfaz Tecnico si es necesario
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

  return {
    ordenes,
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
    tecnicos,
    showAsignacionModal,
    loadingTecnicos,
    totalPages,
    stateOptions,
    userOptions,
    handleCloseAsignacionModal,
    handleConfirmAsignacion,
    handlePageChange
  };
};
