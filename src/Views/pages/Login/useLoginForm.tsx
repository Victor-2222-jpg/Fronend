import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../core/services/Auth/auth.service';
import type { Credentials } from '../../../core/Models/Login/Credentials';


export const useLoginForm = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = useState<Credentials>({
    email: '',
    password: ''
  });
  
  // Estados UI
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes de error cuando el usuario empieza a escribir
    if (error) {
      setError('');
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar los campos del formulario
    if (!formData.email.trim() || !formData.password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
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

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
};