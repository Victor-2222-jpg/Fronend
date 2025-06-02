// src/shared/components/Pagination/Pagination.tsx
import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  // Calcular rango de botones a mostrar
  const getPageRange = (): number[] => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const halfWay = Math.floor(maxPageButtons / 2);
    
    if (currentPage <= halfWay) {
      return Array.from({ length: maxPageButtons }, (_, i) => i + 1);
    }
    
    if (currentPage > totalPages - halfWay) {
      return Array.from({ length: maxPageButtons }, (_, i) => totalPages - maxPageButtons + i + 1);
    }
    
    return Array.from({ length: maxPageButtons }, (_, i) => currentPage - halfWay + i);
  };

  const pageNumbers = getPageRange();

  return (
    <div className={`pagination-container ${className}`}>
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        &laquo;
      </button>
      
      {!pageNumbers.includes(1) && (
        <>
          <button 
            className="pagination-button"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          <span className="pagination-ellipsis">...</span>
        </>
      )}
      
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`pagination-button ${number === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
          aria-label={`Página ${number}`}
          aria-current={number === currentPage ? "page" : undefined}
        >
          {number}
        </button>
      ))}
      
      {!pageNumbers.includes(totalPages) && (
        <>
          <span className="pagination-ellipsis">...</span>
          <button 
            className="pagination-button"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Página ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;