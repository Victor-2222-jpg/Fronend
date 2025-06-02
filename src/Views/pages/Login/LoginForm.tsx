import React from 'react';
import './LoginForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import logoJibe from '../../../assets/images/Logo-grupo-Jibe-1.png';
import { useLoginForm } from './useLoginForm';

const LoginForm: React.FC = () => {
  const {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="login-background">
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <div className="container-box shadow">
          {/* Panel izquierdo con logo */}
          <div className="left-panel">
            <img src={logoJibe} alt="Grupo JIBE" />
          </div>
          
          {/* Panel derecho con formulario */}
          <div className="right-panel">
            <h3 className="mb-3 text-center">Iniciar Sesión</h3>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ejemplo@dominio.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Form.Group>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="danger"
                  type="submit"
                  disabled={isLoading}
                  className="btn-login"
                >
                  {isLoading ? 'Procesando...' : 'Entrar'}
                </Button>
              </div>
            </Form>
            
            <div className="text-center mt-4">
              <p className="mb-0">Sistema de Mantenimiento - Grupo JIBE</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginForm;