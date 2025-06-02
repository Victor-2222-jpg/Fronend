import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import config from '../../config/config';

// Creamos una instancia personalizada de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para las solicitudes
apiClient.interceptors.request.use(
  (config: import('axios').InternalAxiosRequestConfig) => {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');
    
    // Si existe un token, lo añadimos al header de autorización
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // También puedes mostrar un indicador de carga global aquí
    // Por ejemplo: store.dispatch(setLoading(true));
    
    return config;
  },
  (error: AxiosError) => {
    // Manejar errores en las solicitudes
    // Por ejemplo: store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Procesar las respuestas exitosas
    // Por ejemplo: store.dispatch(setLoading(false));
    
    return response;
  },
  (error: AxiosError) => {
    
   
    if (error.response && error.response.status === 401) {
     
      
    }
    
    if (error.response && error.response.status === 403) {
      
      console.error('No tienes permisos para realizar esta acción');
    }
    
    if (error.response && error.response.status >= 500) {
      console.error('Error en el servidor, intente más tarde');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;