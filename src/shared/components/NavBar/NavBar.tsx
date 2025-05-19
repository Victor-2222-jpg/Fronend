import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logoJibe from '../../../assets/images/jibeLogo.png'; // Ajusta la ruta según donde tengas el logo

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top jibe-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          <img src={logoJibe} alt="Grupo JIBE" className="logo-navbar" />
        </Link>
        
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
            <li className="nav-item">
              <Link className="nav-link" to="/pendientes">PENDIENTES</Link>
            </li>
          </ul>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;