import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Welcome.css';

const Welcome = () => {
  return (
    <>
      <div className="overlay-container">
        <img alt="banner" src="/drawable/noas.png" className="img-fluid w-100" />
        <div className="overlay"></div>
        <div className="caption-custom text-center">
          <p className="title col-12">INMOBILIARIA</p>
          <p className="subtitle rowdies-bold">¡Encuentra la propiedad que buscas!</p>
          <p><Link to="/catalogo" className="btn btn-warning mt-3">Ver catálogo</Link></p>
        </div>
      </div>

      <section className="about section-padding" id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12 ps-lg-5 mt-md-5">
              <div className="about-text">
                <h2 className="rowdies-bold mb-4 text-center">NOSOTROS</h2>
                <h2 className="text-center">¿Por qué nosotros?</h2>
                <div className="row mt-4">
                  {[
                    {
                      img: "/drawable/manos_dibujo-removebg-preview.png",
                      title: "Experiencia y profesionalismo",
                      text: "En Inversiones Inmobiliarias, contamos con años de experiencia en el mercado y un equipo de profesionales dedicados a brindarte el mejor servicio."
                    },
                    {
                      img: "/drawable/palomitaa.png",
                      title: "Transparencia y Confianza",
                      text: "Priorizamos la transparencia en cada transacción, asegurándonos de que entiendas todos los aspectos del proceso de compra o renta."
                    },
                    // ... Agrega los demás elementos aquí
                  ].map((item, index) => (
                    <div key={index} className="col-md-4 mb-3">
                      <img src={item.img} className="img-fluid" alt={item.title} />
                      <p><strong>{item.title}</strong><br/>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact section-padding" id="contact">
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header text-center">
                <h1>CONTÁCTANOS</h1>
                <p><span>Dirección:</span> Av. Hidalgo #123, Colonia Centro, Torreón, Coahuila, México</p>
                <p><span>Teléfono:</span> +52 871 123 4567</p>
                <p><span>Correo Electrónico:</span> contacto@inmobiliaria.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Welcome;