import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import type { OrdenHistorial } from '../../../core/Models/Ordenes/ordenhistorial';
import { OrdenService } from '../../../core/services/Orden/OrdenService.service';

interface OrdenHistorialProps {
  show: boolean;
  onHide: () => void;
  ordenId?: number;
}

// Interfaz modificada para trabajar con fechas como Date
interface RegistroHistorialEditable extends Omit<OrdenHistorial, 'fecha_inicio' | 'fecha_fin'> {
  fecha_inicio: Date;
  fecha_fin: Date;
  editando?: boolean;
  fechaInicioTemp?: Date | null;
  fechaFinTemp?: Date | null;
}

const OrdenHistorialModal: React.FC<OrdenHistorialProps> = ({
  show,
  onHide,
  ordenId
}) => {
  const [historial, setHistorial] = useState<RegistroHistorialEditable[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const ordenService = new OrdenService();

  // Función para calcular horas trabajadas usando objetos Date
  const calcularHorasTrabajadas = (fechaInicio: Date, fechaFin: Date): number => {
    const diffMs = fechaFin.getTime() - fechaInicio.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Redondear a 2 decimales
  };

  // Función para validar fechas usando objetos Date
  const validarFechas = (fechaInicio: Date | null | undefined, fechaFin: Date | null | undefined): boolean => {
    if (!fechaInicio || !fechaFin) return false;
    
    return !isNaN(fechaInicio.getTime()) && 
           !isNaN(fechaFin.getTime()) && 
           fechaInicio < fechaFin;
  };

  // Función auxiliar para convertir string/Date a Date
  const convertirADate = (fecha: string | Date): Date => {
    return fecha instanceof Date ? fecha : new Date(fecha);
  };

  // Función auxiliar para convertir Date a string para datetime-local input
  const convertirDateADatetimeLocal = (fecha: Date): string => {
    return fecha.toISOString().slice(0, 16);
  };

  // Cargar historial desde la API
  // Cargar historial desde la API
const fetchHistorial = async () => {
  if (!ordenId) return;

  try {
    setLoading(true);
    setError(null);
    
    console.log('Cargando historial para orden:', ordenId);
    const historialData = await ordenService.obtenerHistorial(ordenId);
    console.log('Datos recibidos del servicio:', historialData);
    
    if (!Array.isArray(historialData)) {
      console.error('Los datos no son un array:', historialData);
      setError('Formato de datos inválido');
      return;
    }

    // Convertir a formato editable usando los campos correctos de la API
    const historialEditable = historialData.map(registro => {
      
      
      return {
        ...registro,
        // Mapear los campos de la API a los campos que espera el componente
        fecha_inicio: convertirADate(registro.inicio_trabajo), // ← Campo correcto de la API
        fecha_fin: convertirADate(registro.fin_trabajo),       // ← Campo correcto de la API
        editando: false,
        fechaInicioTemp: convertirADate(registro.inicio_trabajo),
        fechaFinTemp: convertirADate(registro.fin_trabajo)
      };
    });
    
    console.log('Historial procesado:', historialEditable);
    setHistorial(historialEditable);
    
  } catch (error) {
    console.error('Error al cargar historial:', error);
    setError('Error al cargar el historial de la orden');
  } finally {
    setLoading(false);
  }
};

  // Cargar historial cuando se abre el modal
  useEffect(() => {
    if (show && ordenId) {
      fetchHistorial();
    }
  }, [show, ordenId]);

  // Limpiar estado al cerrar
  const handleClose = () => {
    setHistorial([]);
    setError(null);
    setValidated(false);
    onHide();
  };

  // Activar modo edición
  const activarEdicion = (id: number) => {
    setHistorial(historial.map(registro => 
      registro.id === id 
        ? { 
            ...registro, 
            editando: true,
            fechaInicioTemp: new Date(registro.fecha_inicio),
            fechaFinTemp: new Date(registro.fecha_fin)
          }
        : registro
    ));
  };

  // Cancelar edición
  const cancelarEdicion = (id: number) => {
    setHistorial(historial.map(registro => 
      registro.id === id 
        ? { 
            ...registro, 
            editando: false,
            fechaInicioTemp: new Date(registro.fecha_inicio),
            fechaFinTemp: new Date(registro.fecha_fin)
          }
        : registro
    ));
  };

  // Guardar cambios
  const guardarCambios = (id: number) => {
    const registro = historial.find(r => r.id === id);
    if (!registro || !registro.fechaInicioTemp || !registro.fechaFinTemp) return;

    if (!validarFechas(registro.fechaInicioTemp, registro.fechaFinTemp)) {
      alert('Las fechas no son válidas. La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }

    // Actualizar el registro
    setHistorial(historial.map(r => 
      r.id === id 
        ? {
            ...r,
            fecha_inicio: new Date(registro.fechaInicioTemp!),
            fecha_fin: new Date(registro.fechaFinTemp!),
            horas_trabajadas: calcularHorasTrabajadas(
              new Date(registro.fechaInicioTemp!), 
              new Date(registro.fechaFinTemp!)
            ),
            editando: false,
            fechaInicioTemp: null,
            fechaFinTemp: null
          }
        : r
    ));

    
    console.log('Guardando cambios para registro:', id);
  };

  // Actualizar campo temporal
  const actualizarCampoTemporal = (id: number, campo: 'fechaInicioTemp' | 'fechaFinTemp', valor: string) => {
    const nuevaFecha = new Date(valor);
    
    setHistorial(historial.map(registro => 
      registro.id === id 
        ? { ...registro, [campo]: nuevaFecha }
        : registro
    ));
  };

  // Eliminar registro
  const eliminarRegistro = (id: number) => {
    const confirmacion = window.confirm('¿Está seguro de que desea eliminar este registro?');
    
    if (confirmacion) {
      setHistorial(historial.filter(registro => registro.id !== id));
      // Aquí podrías agregar la llamada a la API para eliminar el registro
      console.log('Eliminando registro:', id);
    }
  };

  // Formatear fecha para mostrar (acepta objetos Date)
  const formatearFechaParaMostrar = (fecha: Date): string => {
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Historial de Asignaciones
          {ordenId && <small className="text-muted ms-2">- Orden #{ordenId}</small>}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-2">Cargando historial...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
          </Alert>
        ) : (
          <div className="tabla-historial">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Técnico</th>
                  <th style={{ width: '25%' }}>Fecha y Hora de Inicio</th>
                  <th style={{ width: '25%' }}>Fecha y Hora de Fin</th>
                  <th style={{ width: '15%' }}>Horas Trabajadas</th>
                  <th style={{ width: '10%' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No hay registros de historial para esta orden
                    </td>
                  </tr>
                ) : (
                  historial.map((registro) => (
                    console.log('Registro:', registro),
                    <tr key={registro.id}>
                      {/* Columna Técnico */}
                      <td>
                        <strong>{registro.tecnico.nombre}</strong>
                        <br />
                        <small className="text-muted">ID: {registro.tecnico.id}</small>
                      </td>

                      {/* Columna Fecha de Inicio */}
                      <td>
                        {registro.editando ? (
                          <Form.Control
                            type="datetime-local"
                            value={registro.fechaInicioTemp ? convertirDateADatetimeLocal(registro.fechaInicioTemp) : ''}
                            onChange={(e) => actualizarCampoTemporal(registro.id, 'fechaInicioTemp', e.target.value)}
                            isInvalid={
                             registro.fechaInicioTemp && 
                            registro.fechaFinTemp && 
                            !validarFechas(registro.fechaInicioTemp, registro.fechaFinTemp) || false
                        }
                          />
                        ) : (
                          formatearFechaParaMostrar(registro.fecha_inicio)
                        )}
                      </td>

                      {/* Columna Fecha de Fin */}
                      <td>
                        {registro.editando ? (
                          <Form.Control
                            type="datetime-local"
                            value={registro.fechaFinTemp ? convertirDateADatetimeLocal(registro.fechaFinTemp) : ''}
                            onChange={(e) => actualizarCampoTemporal(registro.id, 'fechaFinTemp', e.target.value)}
                            isInvalid={
                                    registro.fechaInicioTemp && 
                                     registro.fechaFinTemp && 
                                    !validarFechas(registro.fechaInicioTemp, registro.fechaFinTemp) || false
                                    }           
                          />
                        ) : (
                          formatearFechaParaMostrar(registro.fecha_fin)
                        )}
                      </td>

                      {/* Columna Horas Trabajadas */}
                      <td>
                        <span className="badge bg-info">
                          {registro.editando && registro.fechaInicioTemp && registro.fechaFinTemp
                            ? calcularHorasTrabajadas(registro.fechaInicioTemp, registro.fechaFinTemp)
                            : registro.horas_trabajadas
                          } hrs
                        </span>
                      </td>

                      {/* Columna Acciones */}
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          {registro.editando ? (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => guardarCambios(registro.id)}
                                title="Guardar cambios"
                                disabled={!registro.fechaInicioTemp || !registro.fechaFinTemp || 
                                         !validarFechas(registro.fechaInicioTemp, registro.fechaFinTemp)}
                              >
                                <FaSave />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => cancelarEdicion(registro.id)}
                                title="Cancelar edición"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => activarEdicion(registro.id)}
                                title="Editar registro"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => eliminarRegistro(registro.id)}
                                title="Eliminar registro"
                              >
                                <FaTrash />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {/* Resumen total */}
            {historial.length > 0 && (
              <div className="mt-3 p-3 bg-light rounded">
                <h6>Resumen:</h6>
                <div className="row">
                  <div className="col-md-4">
                    <strong>Total de registros:</strong> {historial.length}
                  </div>
                  <div className="col-md-4">
                    <strong>Total de horas:</strong> {' '}
                    <span className="badge bg-primary">
                      {historial.reduce((total, registro) => total + registro.horas_trabajadas, 0).toFixed(2)} hrs
                    </span>
                  </div>
                  <div className="col-md-4">
                    <strong>Técnicos involucrados:</strong> {' '}
                    {new Set(historial.map(r => r.tecnico.id)).size}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          onClick={fetchHistorial}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Actualizando...
            </>
          ) : (
            'Enviar cambios'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrdenHistorialModal;