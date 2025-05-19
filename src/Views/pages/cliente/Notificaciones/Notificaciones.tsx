import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './Notificacion.css'; // Crearemos este archivo para algunos estilos adicionales

interface FormularioNotificacion {
  categoria: string;
  subcategoria: string;
  descripcion: string;
}

const Notificaciones: React.FC = () => {
  const [formulario, setFormulario] = useState<FormularioNotificacion>({
    categoria: '',
    subcategoria: '',
    descripcion: ''
  });

  // Estados para los buscadores
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [busquedaSubcategoria, setBusquedaSubcategoria] = useState('');

  // Estados para controlar la visualización de resultados
  const [mostrarResultadosCategoria, setMostrarResultadosCategoria] = useState(false);
  const [mostrarResultadosSubcategoria, setMostrarResultadosSubcategoria] = useState(false);
  
  const [enviado, setEnviado] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  // Categorías disponibles para mantenimiento
  const categorias = [
    'Concretos : Concretos : Planta Concretos La Unión',
    'Concretos : Concretos : Planta Concretos Mieleras',
    'Concretos : Concretos : Planta Concretos Móvil 3',
    'Concretos : Concretos : Planta Concretos Móvil 1',
    'Concretos : Concretos : Planta Concretos Durango',
    'Concretos : Concretos : Planta Concretos Ramos',
    'Concretos : Concretos : Planta Concretos Parras',
  ];

  // Subcategorías disponibles (independientes de la categoría)
  const todasSubcategorias = [
    'Produccion de materiales : Produccion de materiales : Concretos'
  ];

  // Filtrar categorías según la búsqueda
  const categoriasFiltradas = categorias.filter(cat => 
    cat.toLowerCase().includes(busquedaCategoria.toLowerCase())
  );

  // Filtrar subcategorías según la búsqueda
  const subcategoriasFiltradas = todasSubcategorias.filter(subcat => 
    subcat.toLowerCase().includes(busquedaSubcategoria.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar mensajes al cambiar cualquier campo
    if (enviado || error) {
      setEnviado(false);
      setError(null);
    }
  };

  // Manejador para seleccionar una categoría de la lista
  const seleccionarCategoria = (categoria: string) => {
    setFormulario(prev => ({
      ...prev,
      categoria
    }));
    setBusquedaCategoria(categoria);
    setMostrarResultadosCategoria(false);
  };

  // Manejador para seleccionar una subcategoría de la lista
  const seleccionarSubcategoria = (subcategoria: string) => {
    setFormulario(prev => ({
      ...prev,
      subcategoria
    }));
    setBusquedaSubcategoria(subcategoria);
    setMostrarResultadosSubcategoria(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formulario.categoria) {
      setError('Por favor, selecciona una categoría');
      return;
    }
    if (!formulario.subcategoria) {
      setError('Por favor, selecciona una subcategoría');
      return;
    }
    if (!formulario.descripcion.trim()) {
      setError('Por favor, proporciona una descripción del problema');
      return;
    }

    try {
      // Indicador de carga
      setCargando(true);
      
      // Enviamos los datos al endpoint
      const response = await axios.post('http://192.168.1.144:3000/cliente/notificacion', formulario);
      
      console.log('Respuesta del servidor:', response.data);
      
      // Mostrar mensaje de éxito
      setEnviado(true);
      
      // Reiniciar formulario
      setFormulario({
        categoria: '',
        subcategoria: '',
        descripcion: ''
      });
      setBusquedaCategoria('');
      setBusquedaSubcategoria('');
      
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setError('Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 mt-5">
      <div className="card shadow-sm" style={{width: '600px', maxWidth: '100%'}}>
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0 text-center">Solicitud de Mantenimiento</h4>
        </div>
        <div className="card-body p-4">
          {enviado && (
            <Alert variant="success" dismissible onClose={() => setEnviado(false)}>
              <Alert.Heading>¡Solicitud enviada con éxito!</Alert.Heading>
              <p>
                Su solicitud de mantenimiento ha sido registrada. 
                Un técnico revisará su caso y le contactará a la brevedad.
              </p>
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Buscador de Categoría */}
            

            {/* Buscador de Subcategoría */}
            <Form.Group className="mb-3 position-relative">
              <Form.Label>Departamento:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar departamentos ..."
                value={busquedaSubcategoria}
                onChange={(e) => {
                  setBusquedaSubcategoria(e.target.value);
                  setMostrarResultadosSubcategoria(true);
                }}
                onFocus={() => setMostrarResultadosSubcategoria(true)}
                onBlur={() => {
                  setTimeout(() => setMostrarResultadosSubcategoria(false), 200);
                }}
              />

              {mostrarResultadosSubcategoria && subcategoriasFiltradas.length > 0 && (
                <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                  {subcategoriasFiltradas.map((subcat, index) => (
                    <ListGroup.Item 
                      key={index}
                      action
                      onClick={() => seleccionarSubcategoria(subcat)}
                      className="cursor-pointer"
                    >
                      {subcat}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {mostrarResultadosSubcategoria && subcategoriasFiltradas.length === 0 && busquedaSubcategoria && (
                <div className="text-muted small mt-2">
                  No se encontraron Departamentos que coincidan con "{busquedaSubcategoria}"
                </div>
              )}


              <Form.Label>Clase:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar clase..."
                value={busquedaCategoria}
                onChange={(e) => {
                  setBusquedaCategoria(e.target.value);
                  setMostrarResultadosCategoria(true);
                }}
                onFocus={() => setMostrarResultadosCategoria(true)}
                onBlur={() => {
                  setTimeout(() => setMostrarResultadosCategoria(false), 200);
                }}
              />

              {mostrarResultadosCategoria && categoriasFiltradas.length > 0 && (
                <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                  {categoriasFiltradas.map((cat, index) => (
                    <ListGroup.Item 
                      key={index}
                      action
                      onClick={() => seleccionarCategoria(cat)}
                      className="cursor-pointer"
                    >
                      {cat}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              <Form.Group className="mb-3 position-relative">
          
              
              {mostrarResultadosCategoria && categoriasFiltradas.length === 0 && busquedaCategoria && (
                <div className="text-muted small mt-2">
                  No se encontraron ubicaciones que coincidan con "{busquedaCategoria}"
                </div>
              )}
            </Form.Group>
            
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Descripción del problema:</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
                rows={4}
                placeholder="Describa detalladamente el problema que presenta..."
                required
              />
              <Form.Text className="text-muted">
                Sea específico para que podamos entender mejor el problema.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-center gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={cargando}
              >
                {cargando ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </div>
          </Form>
        </div>
        <div className="card-footer text-muted text-center">
          <small>Los tiempos de respuesta pueden variar según la prioridad y disponibilidad de técnicos.</small>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;