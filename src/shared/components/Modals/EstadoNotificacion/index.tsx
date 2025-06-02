import React, { useState } from 'react';
import BaseModal from '../BaseModal';
import { Button, Form } from 'react-bootstrap';
import './EstadoNotificacion.css';
import type { EstadoNotificacionModalProps } from '../../../../core/Models/estadonotificacionotificacionmodal';


const EstadoNotificacionModal: React.FC<EstadoNotificacionModalProps> = ({
  show,
  onHide,
  notificacion,
  accion,
  onConfirm
}) => {
  const [incluirObservaciones, setIncluirObservaciones] = useState<boolean>(false);
  const [observaciones, setObservaciones] = useState<string>('');
  const [validated, setValidated] = useState<boolean>(false);

  if (!notificacion) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación: si se marca incluir observaciones, éstas no pueden estar vacías
    if (incluirObservaciones && observaciones.trim() === '') {
      setValidated(true);
      return;
    }
    
    // Determinar el nuevo estado basado en la acción
    const nuevoEstado = accion === 'aceptar' ? 'aceptada' : 'cancelada';
    
    // Llamar a la función de confirmación con los datos
    onConfirm(
      notificacion.id, 
      nuevoEstado, 
      incluirObservaciones ? observaciones : null
    );
    
    // Limpiar el estado y cerrar el modal
    resetForm();
    onHide();
  };
  
  // Función para resetear el formulario
  const resetForm = () => {
    setIncluirObservaciones(false);
    setObservaciones('');
    setValidated(false);
  };
  
  // Al cerrar el modal, resetear el formulario
  const handleClose = () => {
    resetForm();
    onHide();
  };

  // Título y texto basados en la acción (aceptar o rechazar)
  const modalTitle = accion === 'aceptar' 
    ? `Aceptar Notificación #${notificacion.id}` 
    : `Cancelar Notificación #${notificacion.id}`;
    
   const actionText = accion === 'aceptar' 
  ? "aceptar" 
  : accion === 'actualizar'
    ? "actualizar"
    : "cancelar";
    
  const buttonVariant = accion === 'aceptar' 
    ? "success" 
    : "danger";

  return (
    <BaseModal 
      show={show} 
      onHide={handleClose} 
      title={modalTitle}
      footer={null} // Sin footer predeterminado, usaremos uno personalizado dentro del form
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="estado-notificacion-container">
          <p className="confirmacion-texto">
            ¿Está seguro que desea {actionText} la notificación?
          </p>
          
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox"
              id="incluir-observaciones"
              label="Incluir observaciones"
              checked={incluirObservaciones}
              onChange={(e) => setIncluirObservaciones(e.target.checked)}
            />
          </Form.Group>
          
          {incluirObservaciones && (
            <Form.Group className="mb-3">
              <Form.Label>Observaciones:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                required
                isInvalid={validated && observaciones.trim() === ''}
                className="form-control-observaciones"
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingrese observaciones.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            
            <Button variant={buttonVariant} type="submit">
              {accion === 'aceptar' ? 'Aceptar' : 'Cancelar'}
              disabled={false}
            </Button>
          </div>
        </div>
      </Form>
    </BaseModal>
  );
};

export default EstadoNotificacionModal;