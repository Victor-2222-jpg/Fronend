import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { OrdenTrabajo } from '../../../../core/Models/Ordenes/orden.interface';
import type { Tecnico } from '../../../../core/Models/Ordenes/Tecnico.interface';
import './OrdenAsignacion.css';
import type { OrdenEnvio } from '../../../../core/Models/Ordenes/ordenenvio.interface';
import { OrdenService } from '../../../../core/services/Orden/OrdenService.service';

interface OrdenAsignacionModalProps {
  show: boolean;
  onHide: () => void;
  orden: OrdenTrabajo | null;
  tecnicos?: Tecnico[]; // Hacemos que tecnicos sea opcional
  onConfirm?: (ordenId: number, tecnicoId: number, fechaInicio: string, fechaFin: string) => void;
  isLoading?: boolean;
  usuarioCreador?: { id: number };
}

const OrdenAsignacionModal: React.FC<OrdenAsignacionModalProps> = ({
  show,
  onHide,
  orden,
  tecnicos = [], // Valor por defecto como array vacío
  onConfirm,
  isLoading = false,
  usuarioCreador  // Valor por defecto para el usuario creador
}) => {
  const [tecnicoId, setTecnicoId] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [errors, setErrors] = useState<{
    tecnico?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }>({});
  const ordenService = new OrdenService();

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (show) {
      // Si la orden ya tiene un técnico asignado, preseleccionarlo
      if (orden?.tecnico?.id) {
        setTecnicoId(orden.tecnico.id);
      } else {
        setTecnicoId(0);
      }
      
      // Si la orden ya tiene fechas, mostrarlas
      if (orden?.fecha_inicio) {
        // Formatear la fecha para el input (YYYY-MM-DD)
        setFechaInicio(new Date(orden.fecha_inicio).toISOString().split('T')[0]);
      } else {
        setFechaInicio('');
      }
      
      if (orden?.fecha_fin) {
        setFechaFin(new Date(orden.fecha_fin).toISOString().split('T')[0]);
      } else {
        setFechaFin('');
      }
      
      setErrors({});
    }
  }, [show, orden]);

  const validateForm = (): boolean => {
    const newErrors: {
      tecnico?: string;
      fechaInicio?: string;
      fechaFin?: string;
    } = {};
    
    if (!tecnicoId) {
      newErrors.tecnico = 'Debe seleccionar un técnico';
    }
    
    if (!fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    
    if (!fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    } else if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (validateForm() && orden) {
      setIsSubmitting(true);
      try {
        // Preparar datos para enviar al API
        const ordenData: OrdenEnvio = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: 'en proceso', 
          notificacion: {
            id: orden.id, // Asegúrate de que la notificación tenga un ID
          },

          tecnicoResponsable:{
            id: tecnicoId,
            
          } ,
          usuarioCreador: {
            id: usuarioCreador?.id || 1 
          },
        };
        
        // Llamar al servicio para crear la orden
        console.log('Datos de la orden a enviar:', usuarioCreador.id);
        const response = await ordenService.crearOrden(ordenData);
        console.log('Orden creada exitosamente:', response);
        
        // Llamar a onConfirm si existe, para actualizar el estado en el componente padre
        if (onConfirm) {
          onConfirm(orden.id, tecnicoId, fechaInicio, fechaFin);
        }
        
        // Cerrar el modal
        onHide();
        
        // Mostrar mensaje de éxito
        alert('Orden de trabajo creada exitosamente');
        
      } catch (error) {
        console.error('Error al crear orden de trabajo:', error);
        alert('Ocurrió un error al crear la orden de trabajo');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
      className="orden-asignacion-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Asignación de Orden de Trabajo {orden ? `#${orden.id}` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {orden ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Técnico encargado</Form.Label>
              <Form.Select
                value={tecnicoId}
                onChange={(e) => setTecnicoId(Number(e.target.value))}
                isInvalid={!!errors.tecnico}
                disabled={isLoading}
              >
                <option value="0">Seleccione un técnico</option>
                {tecnicos && tecnicos.length > 0 ? (
                  tecnicos.map((tecnico) => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando técnicos...</option>
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.tecnico}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    isInvalid={!!errors.fechaInicio}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaInicio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    isInvalid={!!errors.fechaFin}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaFin}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {orden.notificacion && (
              <div className="orden-info mt-3">
                <h5>La orden sera creada con los sigueintes datos:</h5>
                <div className="orden-info-item">
                  <strong>Estado:</strong> {orden.estado}
                </div>
                <div className="orden-info-item">
                  <strong>Fecha de creación:</strong>{' '}
                  {new Date(orden.fecha_creacion).toLocaleDateString('es-MX')}
                </div>
                <div className="orden-info-item">
                  <strong>Tipo:</strong> {orden.notificacion.tipo_notificacion}
                </div>
                <div className="orden-info-item">
                  <strong>Descripción:</strong> {orden.notificacion.descripcion}
                </div>
              </div>
            )}
          </Form>
        ) : (
          <div className="text-center py-4">
            <p>No se ha seleccionado ninguna orden</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={onConfirm}
        >
         Asignar Tecnicos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrdenAsignacionModal;