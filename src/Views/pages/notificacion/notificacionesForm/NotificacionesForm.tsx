import React from 'react';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import './NotificacionesForm.css';
import { useNotificaciones } from './useNotificacionesForm';

const Notificaciones: React.FC = () => {
  const {
    // Estados
    formulario,
    cargandoDatos,
    busquedaCategoria,
    busquedaSubcategoria,
    busquedaSubsidiaria,
    mostrarResultadosCategoria,
    mostrarResultadosSubcategoria,
    mostrarResultadosSubsidiaria,
    enviado,
    error,
    cargando,
    
    // Datos procesados
    clasesFiltradas,
    departamentosFiltrados,
    subsidiariasFiltradas,
    
    // Manejadores
    handleChange,
    seleccionarCategoria,
    seleccionarSubcategoria,
    seleccionarSubsidiaria,
    handleSubmit,
    handleBusquedaCategoriaChange,
    handleBusquedaSubcategoriaChange,
    handleBusquedaSubsidiariaChange,
    handleCategoriaFocus,
    handleSubcategoriaFocus,
    handleSubsidiariaFocus,
    handleCategoriaBlur,
    handleSubcategoriaBlur,
    handleSubsidiariaBlur,
    setError,
    setEnviado
  } = useNotificaciones();

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 mt-5">
      <div className="card shadow-sm" style={{width: '600px', maxWidth: '100%'}}>
        <div className="card-header text-white">
          <h4 className="mb-0 text-center">Notificación</h4>
        </div>
        <div className="card-body p-4">
          {enviado && (
            <Alert variant="success" dismissible onClose={() => setEnviado(false)}>
              <Alert.Heading>¡Notificación enviada con éxito!</Alert.Heading>
              <p>
                Su notificación ha sido registrada. 
                Un técnico revisará su caso y le contactará a la brevedad.
              </p>
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {cargandoDatos ? (
            <div className="text-center py-4">
              <p>Cargando datos, por favor espere...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* NUEVO: Buscador de Subsidiaria */}
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Subsidiaria:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar subsidiaria..."
                  value={busquedaSubsidiaria}
                  onChange={handleBusquedaSubsidiariaChange}
                  onFocus={handleSubsidiariaFocus}
                  onBlur={handleSubsidiariaBlur}
                />

                {mostrarResultadosSubsidiaria && subsidiariasFiltradas.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {subsidiariasFiltradas.map((subsidiaria) => (
                      <ListGroup.Item 
                        key={subsidiaria.id}
                        action
                        onClick={() => seleccionarSubsidiaria(subsidiaria)}
                        className="cursor-pointer"
                      >
                        {subsidiaria.nombre}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {mostrarResultadosSubsidiaria && subsidiariasFiltradas.length === 0 && busquedaSubsidiaria && (
                  <div className="text-muted small mt-2">
                    No se encontraron subsidiarias que coincidan con "{busquedaSubsidiaria}"
                  </div>
                )}
              </Form.Group>

              {/* Buscador de Departamento */}
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Departamento:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar departamentos..."
                  value={busquedaSubcategoria}
                  onChange={handleBusquedaSubcategoriaChange}
                  onFocus={handleSubcategoriaFocus}
                  onBlur={handleSubcategoriaBlur}
                />

                {mostrarResultadosSubcategoria && departamentosFiltrados.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {departamentosFiltrados.map((depto) => (
                      <ListGroup.Item 
                        key={depto.id}
                        action
                        onClick={() => seleccionarSubcategoria(depto)}
                        className="cursor-pointer"
                      >
                        {depto.nombre}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {mostrarResultadosSubcategoria && departamentosFiltrados.length === 0 && busquedaSubcategoria && (
                  <div className="text-muted small mt-2">
                    No se encontraron departamentos que coincidan con "{busquedaSubcategoria}"
                  </div>
                )}
              </Form.Group>

              {/* Buscador de Clase */}
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Clase:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar clase..."
                  value={busquedaCategoria}
                  onChange={handleBusquedaCategoriaChange}
                  onFocus={handleCategoriaFocus}
                  onBlur={handleCategoriaBlur}
                />

                {mostrarResultadosCategoria && clasesFiltradas.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {clasesFiltradas.map((clase) => (
                      <ListGroup.Item 
                        key={clase.id}
                        action
                        onClick={() => seleccionarCategoria(clase)}
                        className="cursor-pointer"
                      >
                        {clase.nombre}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                
                {mostrarResultadosCategoria && clasesFiltradas.length === 0 && busquedaCategoria && (
                  <div className="text-muted small mt-2">
                    No se encontraron clases que coincidan con "{busquedaCategoria}"
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3 mt-3">
                <Form.Label>Tipo de Notificación:</Form.Label>
                <Form.Select
                  name="tipo_notificacion"
                  value={formulario.tipo_notificacion}
                  onChange={handleChange}
                  required
                >
                  <option value="falla">Falla</option>
                  <option value="instalacion">Instalación</option>
                  <option value="otro">Otro</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Seleccione "Falla" para reportar un problema o "Instalación" para solicitar un servicio nuevo.
                </Form.Text>
              </Form.Group>

              {/* Campo de descripción */}
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
                  variant="danger" 
                  className='btn-enviar'
                  type="submit"
                  disabled={cargando}
                >
                  {cargando ? 'Enviando...' : 'Enviar Notificación'}
                </Button>
              </div>
            </Form>
          )}
        </div>
        <div className="card-footer text-muted text-center">
          <small>Los tiempos de respuesta pueden variar según la prioridad y disponibilidad de técnicos.</small>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;