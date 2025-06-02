import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import logoJibe from '../../../assets/images/jibeLogo.png';
import useNavBar from './useNavBar';
import tokenService from '../../../core/services/token/token.service';

const Navbar = () => {
  const navigate = useNavigate();
  const { hasRole } = useNavBar();
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // También eliminar info de usuario
    navigate('/login');
  };

  // Verificar si el usuario tiene permisos para ver MIS ORDENES DE TRABAJO (roles 2 y 3)
  const canViewOrders = hasRole([2, 3]);
  const username = tokenService.getUsername();
  const userTipo = tokenService.getuserTipos();


  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top jibe-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          <img src={logoJibe} alt="Grupo JIBE" className="logo-navbar" />
        </Link>

          {username && (
          <div className="user-welcome">
            <span>{userTipo+':' +' '+username}</span>
          </div>
        )}
        
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-0">
            <li className="nav-item">
              <Link className="nav-link" to="/tickets">GENERAR TICKETS</Link>
            </li>
            
            {/* Mostrar MIS ORDENES DE TRABAJO solo para roles 2 y 3 */}
            {canViewOrders && (
              <li className="nav-item">
                <Link className="nav-link" to="/ordenes">MIS ORDENES DE TRABAJO</Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link className="nav-link" to="/pendientes">PENDIENTES</Link>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link logout-button" 
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i> CERRAR SESIÓN
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;