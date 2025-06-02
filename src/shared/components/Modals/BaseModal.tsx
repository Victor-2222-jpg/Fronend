import React from "react";
import { Modal, Button } from 'react-bootstrap';
import './BaseModal.css';


interface BaseModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  footer?: React.ReactNode;
  closeButton?: boolean;
  children?: React.ReactNode;
 // body: React.ReactNode;
  
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onHide,
  title,
  size = 'lg',
  centered = true,
  footer,
  closeButton = true,
  children
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop="static"
      keyboard={false}
      className="app-modal"
    >
      <Modal.Header closeButton={closeButton}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {children}
      </Modal.Body>
      
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
      
      {!footer && closeButton && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
export default BaseModal;