import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-5" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h3 className="display-5 fw-bold">
            Contact <span className="text-warning">Us</span>
          </h3>
          <p className="lead text-muted mt-3">
            Reach us easily via phone, WhatsApp, or visit our location.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="row justify-content-center g-4">
          {/* WhatsApp */}
          <div className="col-md-6 col-lg-4">
            <div className="text-center bg-white p-4 rounded-4 shadow-sm hover-shadow">
              <a
                href="https://wa.me/213778461682"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success d-inline-block mb-3"
                style={{ fontSize: '3rem' }}
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <h4 className="mb-1">
                <a href="https://wa.me/213778461682" className="text-success text-decoration-none" style={{ fontSize: '1.5rem' }}>
                  +213 778 461 682
                </a>
              </h4>
              <p className="text-muted">Chat with us on WhatsApp</p>
            </div>
          </div>

          {/* Call */}
          <div className="col-md-6 col-lg-4">
            <div className="text-center bg-white p-4 rounded-4 shadow-sm hover-shadow">
              <a
                href="tel:+213778461682"
                className="text-primary d-inline-block mb-3"
                style={{ fontSize: '3rem' }}
              >
                <i className="fas fa-phone-alt"></i>
              </a>
              <h4 className="mb-1">
                <a href="tel:+213778461682" className="text-primary text-decoration-none" style={{ fontSize: '1.5rem' }}>
                  +213 778 461 682
                </a>
              </h4>
              <p className="text-muted">Give us a call</p>
            </div>
          </div>

          {/* Address */}
          <div className="col-md-6 col-lg-4">
            <div className="text-center bg-white p-4 rounded-4 shadow-sm hover-shadow">
              <a
                href="https://maps.app.goo.gl/o5DLijMqhsTaiac19"
                target="_blank"
                rel="noopener noreferrer"
                className="text-danger d-inline-block mb-3"
                style={{ fontSize: '3rem' }}
              >
                <i className="fas fa-map-marker-alt"></i>
              </a>
              <h4 className="mb-1">
                <a target="_blank"  
                href="https://maps.app.goo.gl/o5DLijMqhsTaiac19"
              
                
                className="text-dark text-decoration-none" style={{ fontSize: '1.2rem' }}>
                  Medea, Aindhab, Algeria
                </a>
              </h4>
              <p className="text-muted">Visit our location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hover shadow effect */}
      <style>
        {`
          .hover-shadow:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 25px rgba(0,0,0,0.2);
            transition: 0.3s;
          }
          a:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </section>
  );
};

export default Contact;
