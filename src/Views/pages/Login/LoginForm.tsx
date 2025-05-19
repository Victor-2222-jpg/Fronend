import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../core/services/auth.service';
import './LoginForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import logoJibe from '../../../assets/images/jibe.jpg'; // Importa el logo de JIBE

interface LoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.login(formData.email, formData.password);
      const redirectUrl = AuthService.getRedirectUrl();
      console.log('Redirigiendo a:', redirectUrl);
      navigate(redirectUrl);
    } catch (err) {
      console.error('Error en login:', err);
      setError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

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