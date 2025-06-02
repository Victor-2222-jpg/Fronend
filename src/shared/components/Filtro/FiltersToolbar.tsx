import React, { useState } from 'react';
import { BsTable, BsGrid } from 'react-icons/bs';
import { ListGroup } from 'react-bootstrap';
import './FiltersToolbar.css';

// Interfaces para las opciones de los selectores
interface SelectOption {
  value: string;
  label: string;
}

// Props del componente
interface FiltersToolbarProps {
  // Filtro de usuario
  showUserFilter?: boolean;
  userOptions?: SelectOption[];
  userFilterValue?: string;
  onUserFilterChange?: (value: string) => void;
  
  // Filtro de estado
  stateOptions: SelectOption[];
  stateFilterValue: string;
  onStateFilterChange: (value: string) => void;
  
  // Filtros de fecha
  dateFromValue: string;
  onDateFromChange: (value: string) => void;
  dateToValue: string;
  onDateToChange: (value: string) => void;
  
  // Acciones de filtros
  onApplyFilters: () => void;
  onResetFilters: () => void;
  filtersApplied: boolean;
  
  // Vista (opcional)
  showViewToggle?: boolean;
  viewMode?: 'cards' | 'table';
  onViewModeChange?: (mode: 'cards' | 'table') => void;
}

const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
  // Usuario
  showUserFilter = false,
  userOptions = [],
  onUserFilterChange = () => {},
  
  // Estado
  stateOptions,
  stateFilterValue,
  onStateFilterChange,
  
  // Fechas
  dateFromValue,
  onDateFromChange,
  dateToValue,
  onDateToChange,
  
  // Acciones
  onApplyFilters,
  onResetFilters,
  filtersApplied,
  
  // Vista
  showViewToggle = true,
  viewMode = 'cards',
  onViewModeChange = () => {},
}) => {
  // Estado para el buscador de usuarios
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserResults, setShowUserResults] = useState(false);
  const [setSelectedUserLabel] = useState("");
  
  // Filtrar usuarios basados en el término de búsqueda
  const filteredUsers = userSearchTerm
    ? userOptions.filter(user => 
        user.label.toLowerCase().includes(userSearchTerm.toLowerCase()))
    : userOptions;
  
  // Manejador para cambio de estado
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStateFilterChange(e.target.value);
  };
  
  // Manejadores para el buscador de usuarios
  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchTerm(e.target.value);
    setShowUserResults(true);
  };
  
  const handleUserSelect = (user: SelectOption) => {
   
    setUserSearchTerm(user.label);
    onUserFilterChange(user.value);
    setShowUserResults(false);
  };
  
  const handleUserFocus = () => {
    setShowUserResults(true);
  };
  
  const handleUserBlur = () => {
    setTimeout(() => {
      setShowUserResults(false);
    }, 200);
  };
  
  const clearUserFilter = () => {
    setUserSearchTerm("");
    onUserFilterChange("");
  };
  
  // Manejadores para cambio de fechas
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateFromChange(e.target.value);
  };
  
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateToChange(e.target.value);
  };
  
  // Función para alternar el modo de vista
  const toggleViewMode = (mode: 'cards' | 'table') => {
    onViewModeChange(mode);
  };
  
  return (
    <div className="toolbar-container">
      <div className="filters-container">
        {/* Filtro de usuario con buscador (condicional) */}
        {showUserFilter && (
          <div className="filter-group position-relative">
            <label>Filtrar por usuario:</label>
            <div className="search-input-wrapper">
              <input 
                type="text"
                placeholder="Buscar usuario..."
                value={userSearchTerm}
                onChange={handleUserSearchChange}
                onFocus={handleUserFocus}
                onBlur={handleUserBlur}
                className="filter-search"
              />
              {userSearchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={clearUserFilter}
                  title="Limpiar búsqueda"
                >
                  &times;
                </button>
              )}
            </div>
            
            {showUserResults && filteredUsers.length > 0 && (
              <ListGroup className="position-absolute w-100 shadow-sm search-results">
                {filteredUsers.map((user) => (
                  <ListGroup.Item 
                    key={user.value}
                    action
                    onClick={() => handleUserSelect(user)}
                    className="search-result-item"
                  >
                    {user.label}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            
            {showUserResults && filteredUsers.length === 0 && userSearchTerm && (
              <div className="no-results-message">
                No se encontraron usuarios que coincidan con "{userSearchTerm}"
              </div>
            )}
          </div>
        )}
        
        {/* Filtro de estado */}
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select 
            value={stateFilterValue} 
            onChange={handleStateChange}
            className="filter-select"
          >
            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filtro de fecha desde */}
        <div className="filter-group">
          <label>Fecha desde:</label>
          <input 
            type="date" 
            value={dateFromValue} 
            onChange={handleDateFromChange}
            className="filter-date"
          />
        </div>
        
        {/* Filtro de fecha hasta */}
        <div className="filter-group">
          <label>Fecha hasta:</label>
          <input 
            type="date" 
            value={dateToValue} 
            onChange={handleDateToChange}
            className="filter-date" 
          />
        </div>
        
        {/* Botones de acción */}
        <div className="filter-actions">
          <button 
            className="apply-filters-button" 
            onClick={onApplyFilters}
          >
            Aplicar filtros
          </button>
          
          {filtersApplied && (
            <button 
              className="reset-filters-button" 
              onClick={onResetFilters}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
      
      {/* Toggle de vista */}
      {showViewToggle && (
        <div className="view-toggle">
          <button 
            className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => toggleViewMode('table')}
            title="Vista de tabla"
          >
            <BsTable size={20} />
          </button>
          <button 
            className={`view-button ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => toggleViewMode('cards')}
            title="Vista de tarjetas"
          >
            <BsGrid size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltersToolbar;