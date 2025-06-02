import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificacionesService from '../../../../core/services/Notificaciones/Notificaciones.service';
import { ClaseService } from '../../../../core/services/Clases/clase.service';
import { DepartamentoService } from '../../../../core/services/Departamentos/Departamento.service';
import TokenService from '../../../../core/services/token/token.service';
import AuthService from '../../../../core/services/Auth/auth.service';
import type { Subsidiaria } from '../../../../core/Models/Subsidiaria/subsidiaria.interface';
import type { Clase } from '../../../../core/Models/clase.interface';
import type { Departamento } from '../../../../core/Models/departamento.interface';
import type { NotificacionCompleta } from '../../../../core/Models/Notificaciones/notinueva.interface';
import type { FormularioNotificacion } from '../../../../core/Models/Notificaciones/formulario-notificacion.interface';
import { SubsidiariaService } from '../../../../core/services/Subsidiaria/Subsidiaria.service';

export const useNotificaciones = () => {
  const navigate = useNavigate();

  // Estado del formulario
  // Estado del formulario
  const [formulario, setFormulario] = useState<FormularioNotificacion>({
    descripcion: '',
    subsidiaria_id: 0,
    clase_id: 0,
    departamento_id: 0,
    estado_notificacion: 'en revisión',
    tipo_notificacion: 'falla',
    usuarioCreador: { id: 1 },
    usuarioModificador: null // Inicialmente nulo
  });

  // Estados para las opciones dinámicas
  const [clases, setClases] = useState<Clase[]>([]);
  const [subsidiarias, setSubsidiarias] = useState<Subsidiaria[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState<boolean>(true);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<Departamento | null>(null);
const [subsidiariaSeleccionada, setSubsidiariaSeleccionada] = useState<Subsidiaria | null>(null);
  // Estados para el modal de detalle
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState<NotificacionCompleta | null>(null);

  // Estados para los buscadores
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [busquedaSubcategoria, setBusquedaSubcategoria] = useState('');
   const [busquedaSubsidiaria, setBusquedaSubsidiaria] = useState('');

  // Estados para controlar la visualización de resultados
  const [mostrarResultadosCategoria, setMostrarResultadosCategoria] = useState(false);
  const [mostrarResultadosSubcategoria, setMostrarResultadosSubcategoria] = useState(false);
  const [mostrarResultadosSubsidiaria, setMostrarResultadosSubsidiaria] = useState(false);
  
  // Estados para feedback al usuario
  const [enviado, setEnviado] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  // Cargar datos iniciales
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargandoDatos(true);
        
        // Obtener datos de los servicios
        const claseService = new ClaseService();
        const departamentoService = new DepartamentoService();
        const subsidiariaService = new SubsidiariaService();
        
        const [clasesResponse, departamentosResponse,subsidiariasResponse ] = await Promise.all([
          claseService.obtenerClases(),
          departamentoService.obtenerDepartamentos(),
          subsidiariaService.obtenerSubsidiarias()
        ]);
        
        setClases(clasesResponse);
        setDepartamentos(departamentosResponse);
        setSubsidiarias(subsidiariasResponse);
        
        // Obtener ID del usuario autenticado
        const decodedToken = TokenService.decodeToken();
        if (decodedToken) {
          const userId = parseInt(decodedToken.sub);
          
          setFormulario(prev => ({
            ...prev,
            usuarioCreador: {
              id: userId
            }
          }));
        }
        
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setError('Error al cargar datos. Por favor, recargue la página.');
      } finally {
        setCargandoDatos(false);
      }
    };
    
    obtenerDatos();
  }, []);

  // Filtrar resultados de búsqueda
  const clasesFiltradas = busquedaCategoria 
    ? clases.filter(clase => clase.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase()))
    : clases;

  const departamentosFiltrados = busquedaSubcategoria 
    ? departamentos.filter(depto => depto.nombre.toLowerCase().includes(busquedaSubcategoria.toLowerCase()))
    : departamentos;

   const subsidiariasFiltradas = busquedaSubsidiaria 
    ? subsidiarias.filter(sub => sub.nombre.toLowerCase().includes(busquedaSubsidiaria.toLowerCase()))
    : subsidiarias;

  // Manejadores de eventos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (enviado || error) {
      setEnviado(false);
      setError(null);
    }
  };

  const handleShowDetails = (notificacion: NotificacionCompleta) => {
    setSelectedNotificacion(notificacion);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotificacion(null);
  };

  const seleccionarCategoria = (clase: Clase) => {
    setFormulario(prev => ({
      ...prev,
      clase_id: clase.id
    }));
    
    setBusquedaCategoria(clase.nombre);
    setMostrarResultadosCategoria(false);
  };

  const seleccionarSubcategoria = (departamento: Departamento) => {
    setDepartamentoSeleccionado(departamento);
    setFormulario(prev => ({
    ...prev,
    departamento_id: departamento.id
  }));
  
  setBusquedaSubcategoria(departamento.nombre);
  setMostrarResultadosSubcategoria(false);
  };

  const seleccionarSubsidiaria = (subsidiaria: Subsidiaria) => {
    setSubsidiariaSeleccionada(subsidiaria);
    setFormulario(prev => ({
      ...prev,
      subsidiaria_id: subsidiaria.id
    }));
    setBusquedaSubsidiaria(subsidiaria.nombre);
    setMostrarResultadosSubsidiaria(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas

    if (!formulario.subsidiaria_id) {
    setError('Por favor, selecciona una subsidiaria');
    return;
  }
  
  if (!formulario.clase_id) {
    setError('Por favor, selecciona una clase');
    return;
  }
  
  if (!formulario.departamento_id) {
    setError('Por favor, selecciona un departamento');
    return;
  }
  
  if (!formulario.descripcion.trim()) {
    setError('Por favor, proporciona una descripción');
    return;
  }
  
    
    console.log(formulario.usuarioCreador);
    

    try {
      // Indicador de carga
      setCargando(true);
      
      // Creamos el objeto de notificación con la fecha actual
      const notificacionActualizada = {
        ...formulario,
        fecha_notificacion: new Date().toISOString()
      };
      
      // Enviamos los datos usando el servicio
      const decodedToken = TokenService.decodeToken();
      if(!decodedToken) {
        throw new Error('Token no válido o expirado');
      }
      const userId = parseInt(decodedToken.id ?? '0');
      console.log('ID del usuario:', userId);
      notificacionActualizada.usuarioCreador  =  { id: userId };
      console.log(notificacionActualizada);
      const response = await NotificacionesService.crearNotificacion(notificacionActualizada);
      
      console.log('Notificación creada:', response);
      
      // Mostrar mensaje de éxito
      setEnviado(true);
      
      // Reiniciar formulario
            // Reiniciar formulario
      setFormulario({
        descripcion: '',
        subsidiaria_id: 0, // Cambiar de Subsidiaria a subsidiaria_id
        clase_id: 0, // Asegúrate de incluir esta propiedad que estaba en el estado inicial
        departamento_id: 0, // Asegúrate de incluir esta propiedad que estaba en el estado inicial
        estado_notificacion: 'en revisión',
        tipo_notificacion: 'falla',
        usuarioCreador: { id: formulario.usuarioCreador.id },
        usuarioModificador: null // Incluir también esta propiedad
      });
      setBusquedaCategoria('');
      setBusquedaSubsidiaria(''); // Reiniciar búsqueda de subsidiaria
      setDepartamentoSeleccionado(null);
      setSubsidiariaSeleccionada(null);
      
      // Redireccionar después de crear la notificación
      setTimeout(() => {
        try {
          const redirectUrl = AuthService.getRedirectUrl();
          navigate(redirectUrl);
        } catch (err) {
          console.error('Error al redirigir:', err);
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setError('Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  // Manejadores para los campos de búsqueda
  const handleBusquedaCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaCategoria(e.target.value);
    setMostrarResultadosCategoria(true);
  };

  const handleBusquedaSubcategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaSubcategoria(e.target.value);
    setMostrarResultadosSubcategoria(true);
    setDepartamentoSeleccionado(null);
  };

  const handleBusquedaSubsidiariaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaSubsidiaria(e.target.value);
    setMostrarResultadosSubsidiaria(true);
    setSubsidiariaSeleccionada(null);
  };

  const handleCategoriaFocus = () => setMostrarResultadosCategoria(true);
  const handleSubcategoriaFocus = () => setMostrarResultadosSubcategoria(true);
  const handleSubsidiariaFocus = () => setMostrarResultadosSubsidiaria(true);
  
  const handleCategoriaBlur = () => {
    setTimeout(() => setMostrarResultadosCategoria(false), 200);
  };
  
  const handleSubcategoriaBlur = () => {
    setTimeout(() => setMostrarResultadosSubcategoria(false), 200);
  };

   const handleSubsidiariaBlur = () => { // Nuevo manejador
    setTimeout(() => setMostrarResultadosSubsidiaria(false), 200);
  };


  const resetErrores = () => {
    setError(null);
    setEnviado(false);
  };

  return {
    // Estados
    formulario,
    clases,
    departamentos,
    subsidiarias,
    cargandoDatos,
    departamentoSeleccionado,
    subsidiariaSeleccionada,
    showDetailModal,
    selectedNotificacion,
    busquedaCategoria,
    busquedaSubcategoria,
    busquedaSubsidiaria,
    mostrarResultadosCategoria,
    mostrarResultadosSubsidiaria,
    mostrarResultadosSubcategoria,
    enviado,
    error,
    cargando,
    
    // Datos procesados
    clasesFiltradas,
    departamentosFiltrados,
    subsidiariasFiltradas,
    
    // Manejadores
    handleChange,
    handleShowDetails,
    handleCloseModal,
    seleccionarSubsidiaria,
    seleccionarCategoria,
    seleccionarSubcategoria,
    handleSubmit,
    handleBusquedaCategoriaChange,
    handleBusquedaSubsidiariaChange,
    handleBusquedaSubcategoriaChange,
    handleCategoriaFocus,
    handleSubsidiariaFocus,
    handleSubcategoriaFocus,
    handleCategoriaBlur,
    handleSubsidiariaBlur,
    handleSubcategoriaBlur,
    resetErrores,
    setError,
    setEnviado
  };
};


