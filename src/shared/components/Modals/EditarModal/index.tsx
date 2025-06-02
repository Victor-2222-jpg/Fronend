import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { NotificacionCompleta } from '../../../../core/Models/Notificaciones/notinueva.interface';
import OrdenAsignacionModal from '../OrdenAsignacion';
import './EditarModal.css';
import type { Tecnico } from '../../../../core/Models/Ordenes/Tecnico.interface';
import type { OrdenTrabajo } from '../../../../core/Models/Ordenes/orden.interface';

interface NuevaObservacionModalProps {
  show: boolean;
  onHide: () => void;
  notificacion: NotificacionCompleta | null;
  tecnicos?: Tecnico[]; // Nuevo prop para recibir técnicos
  loadingTecnicos?: boolean;
  onGuardar: (id: number, observacion: string) => Promise<void>;
  usuarioLogueado?: any;
}

const NuevaObservacionModal: React.FC<NuevaObservacionModalProps> = ({
  show,
  onHide,
  notificacion,
  onGuardar,
  tecnicos = [],
  loadingTecnicos = false,
  usuarioLogueado 
}) => {
  const [incluirObservacion, setIncluirObservacion] = useState<boolean>(false);
  const [observacion, setObservacion] = useState<string>('');
  const [showOrdenModal, setShowOrdenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (show) {
      setIncluirObservacion(false);
      setObservacion('');
    }
  }, [show]);

  const handleClose = () => {
    onHide();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncluirObservacion(e.target.checked);
    if (!e.target.checked) {
      setObservacion('');
    }
  };

  const handleGuardarObservacion = async () => {
    if (!notificacion) return;
    
    setIsLoading(true);
    try {
      // Guardar la observación si se ha incluido una
      if (incluirObservacion && observacion.trim()) {
        await onGuardar(notificacion.id, observacion);

        setObservacion(''); // Limpiar el campo de observación
      }
      
      // Abrir el modal de asignación de orden
      
    } catch (error) {
      console.error('Error al guardar la observación:', error);
      alert('Ocurrió un error al guardar la observación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrdenModalOpen = () => {
    setShowOrdenModal(true);
    // Cerrar el modal de observación al abrir el de orden
  }

  const handleOrdenModalClose = () => {
    setShowOrdenModal(false);
    onHide(); // También cerramos este modal
  };

  if (!notificacion) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className="nueva-observacion-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {`Nueva Observación - Notificación #${notificacion.id}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="pregunta-observacion">
            ¿Desea añadir una nueva observación?
          </p>

          <Form.Check
            type="checkbox"
            id="incluir-observacion"
            label="Incluir observaciones"
            checked={incluirObservacion}
            onChange={handleCheckboxChange}
            className="mb-3 incluir-observacion-check"
          />

          {incluirObservacion && (
          
            <Form.Group className="mb-3 observacion-container">
              <Form.Control
                as="textarea"
                rows={4}
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Escriba sus observaciones aquí..."
                className="observacion-input"
              />
              <div className="d-flex justify-content-end mt-2">
          <Button
               variant="primary"
               onClick={handleGuardarObservacion}
              disabled={observacion.trim() === '' || isLoading}
             >
              {isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
       </div>
            </Form.Group>
            
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={handleOrdenModalOpen}
            
          >
            Generar Orden de Trabajo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de asignación de orden */}
            <OrdenAsignacionModal
              show={showOrdenModal}
              onHide={handleOrdenModalClose}
              orden={notificacion ? {
                id: notificacion.id,
                estado: notificacion.estado_notificacion,
                fecha_creacion: new Date().toISOString(),
                fecha_inicio: '',
                fecha_fin: '',
                notificacion: notificacion,
                tecnico: null
              } as unknown as OrdenTrabajo : null}
              tecnicos={tecnicos} 
              isLoading={loadingTecnicos} 
              usuarioCreador={usuarioLogueado}
            />
    </>
  );
};

export default NuevaObservacionModal;