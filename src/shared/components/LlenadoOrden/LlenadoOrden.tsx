import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './LlenadoOrden.css';

interface Tecnico {
  id: number;
  nombre: string;
  numero_Telefono: string;
}

interface RegistroAsignacion {
  id: string;
  tecnicoId: number;
  fechaInicio: string;
  fechaFin: string;
  esInicial?: boolean;
}

interface LlenadoOrdenProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (registros: RegistroAsignacion[]) => void;
  tecnicos: Tecnico[];
  tecnicoInicial?: Tecnico;
  fechaInicialInicio?: string;
  fechaInicialFin?: string;
  loading?: boolean;
  ordenId?: number;
}

const LlenadoOrden: React.FC<LlenadoOrdenProps> = ({
  show,
  onHide,
  onConfirm,
  tecnicos,
  tecnicoInicial,
  fechaInicialInicio,
  fechaInicialFin,
  loading = false,
  ordenId
}) => {
  const [registros, setRegistros] = useState<RegistroAsignacion[]>([]);
  const [validated, setValidated] = useState(false);

  // Función auxiliar para validar fechas
  const validarFechas = (fechaInicio: string, fechaFin: string): boolean => {
    if (!fechaInicio || !fechaFin) return false;
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    return !isNaN(inicio.getTime()) && 
           !isNaN(fin.getTime()) && 
           inicio < fin;
  };

  // Inicializar con el primer registro cuando se abre el modal
  useEffect(() => {
    if (show && tecnicoInicial) {
      let fechaInicioDefault: string;
      let fechaFinDefault: string;

      try {
        fechaInicioDefault = fechaInicialInicio 
          ? new Date(fechaInicialInicio).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16);
        
        fechaFinDefault = fechaInicialFin 
          ? new Date(fechaInicialFin).toISOString().slice(0, 16)
          : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
      } catch (error) {
        const ahora = new Date();
        fechaInicioDefault = ahora.toISOString().slice(0, 16);
        fechaFinDefault = new Date(ahora.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
      }

      setRegistros([{
        id: 'inicial',
        tecnicoId: tecnicoInicial.id,
        fechaInicio: fechaInicioDefault,
        fechaFin: fechaFinDefault,
        esInicial: true
      }]);
    }
  }, [show, tecnicoInicial, fechaInicialInicio, fechaInicialFin]);

  // Limpiar estado al cerrar
  const handleClose = () => {
    setRegistros([]);
    setValidated(false);
    onHide();
  };

  // Agregar nuevo registro
  const agregarRegistro = () => {
    const nuevoRegistro: RegistroAsignacion = {
      id: `registro_${Date.now()}`,
      tecnicoId: 0,
      fechaInicio: new Date().toISOString().slice(0, 16),
      fechaFin: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16),
      esInicial: false
    };
    setRegistros([...registros, nuevoRegistro]);
  };

  // Eliminar registro
  const eliminarRegistro = (id: string) => {
    setRegistros(registros.filter(registro => registro.id !== id));
  };

  // Actualizar registro
  const actualizarRegistro = (id: string, campo: keyof RegistroAsignacion, valor: any) => {
    setRegistros(registros.map(registro => 
      registro.id === id 
        ? { ...registro, [campo]: valor }
        : registro
    ));
  };

  // Validar formulario
  const validarFormulario = () => {
    return registros.every(registro => 
      registro.tecnicoId > 0 && 
      validarFechas(registro.fechaInicio, registro.fechaFin)
    );
  };

  // Manejar envío
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);

    if (validarFormulario()) {
      onConfirm(registros);
      handleClose();
    }
  };

  // Obtener nombre del técnico
  const obtenerNombreTecnico = (tecnicoId: number) => {
    return tecnicos.find(t => t.id === tecnicoId)?.nombre || 'Técnico no encontrado';
  };

  // Formatear fecha para mostrar
  const formatearFechaParaMostrar = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
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
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Asignación de Técnicos
          {ordenId && <small className="text-muted ms-2">- Orden #{ordenId}</small>}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="tabla-asignaciones">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Técnico</th>
                  <th style={{ width: '25%' }}>Fecha y Hora de Inicio</th>
                  <th style={{ width: '25%' }}>Fecha y Hora de Fin</th>
                  <th style={{ width: '15%' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, index) => (
                  <tr key={registro.id}>
                    {/* Columna Técnico */}
                    <td>
                      {registro.esInicial ? (
                        <div className="d-flex align-items-center">
                          <strong>{obtenerNombreTecnico(registro.tecnicoId)}</strong>
                          <small className="text-muted ms-2">(Asignación inicial)</small>
                        </div>
                      ) : (
                        <>
                          <Form.Select
                            value={registro.tecnicoId}
                            onChange={(e) => actualizarRegistro(registro.id, 'tecnicoId', parseInt(e.target.value))}
                            required
                            isInvalid={validated && (!registro.tecnicoId || registro.tecnicoId === 0)}
                          >
                            <option value="0">Seleccionar técnico...</option>
                            {tecnicos.map(tecnico => (
                              <option key={tecnico.id} value={tecnico.id}>
                                {tecnico.nombre}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Debe seleccionar un técnico.
                          </Form.Control.Feedback>
                        </>
                      )}
                    </td>

                    {/* Columna Fecha de Inicio */}
                    <td>
                      <Form.Control
                        type="datetime-local"
                        value={registro.fechaInicio}
                        onChange={(e) => actualizarRegistro(registro.id, 'fechaInicio', e.target.value)}
                        required
                        isInvalid={validated && !validarFechas(registro.fechaInicio, registro.fechaFin)}
                      />
                      <Form.Control.Feedback type="invalid">
                        La fecha de inicio es requerida y debe ser anterior a la fecha de fin.
                      </Form.Control.Feedback>
                    </td>

                    {/* Columna Fecha de Fin */}
                    <td>
                      <Form.Control
                        type="datetime-local"
                        value={registro.fechaFin}
                        onChange={(e) => actualizarRegistro(registro.id, 'fechaFin', e.target.value)}
                        required
                        isInvalid={validated && !validarFechas(registro.fechaInicio, registro.fechaFin)}
                      />
                      <Form.Control.Feedback type="invalid">
                        La fecha de fin es requerida y debe ser posterior a la fecha de inicio.
                      </Form.Control.Feedback>
                    </td>

                    {/* Columna Acciones */}
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        {!registro.esInicial && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => eliminarRegistro(registro.id)}
                            title="Eliminar registro"
                          >
                            <FaMinus />
                          </Button>
                        )}
                        
                        {index === registros.length - 1 && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={agregarRegistro}
                            title="Agregar nuevo registro"
                          >
                            <FaPlus />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {registros.length === 0 && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-success"
                  onClick={agregarRegistro}
                >
                  <FaPlus className="me-2" />
                  Agregar Registro
                </Button>
              </div>
            )}
          </div>

          {/* Resumen */}
          {registros.length > 0 && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Resumen de asignaciones:</h6>
              <ul className="mb-0">
                {registros.map((registro) => (
                  <li key={registro.id}>
                    <strong>{obtenerNombreTecnico(registro.tecnicoId)}</strong>: 
                    desde {formatearFechaParaMostrar(registro.fechaInicio)} 
                    hasta {formatearFechaParaMostrar(registro.fechaFin)}
                    {registro.esInicial && <small className="text-muted"> (inicial)</small>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading || registros.length === 0 || !validarFormulario()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Registrar horas'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LlenadoOrden;