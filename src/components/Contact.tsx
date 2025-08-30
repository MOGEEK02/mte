import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="bg-light py-5">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h3 className="display-5 fw-bold">
            Contact <span className="text-warning">Us</span>
          </h3>
          <p className="lead text-muted mt-3">
            Reach us easily via phone, WhatsApp.
          </p>
        </div>

        {/* Contact Info */}
        <div className="row justify-content-center text-center">
          <div className="col-md-8 col-lg-6">
            <div className="bg-white p-4 rounded shadow">
              {/* WhatsApp */}
              <div className="mb-4">
                <a
                  href="https://wa.me/213778461682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center text-success mb-2"
                  style={{ fontSize: '3rem', textDecoration: 'none' }}
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                <h4 className="mb-1">
                  <a href="https://wa.me/213778461682" className="text-success" style={{ fontSize: '1.8rem', textDecoration: 'none' }}>
                    +213 778 461 682
                  </a>
                </h4>
                <p className="text-muted">Chat with us on WhatsApp</p>
              </div>

              {/* Call */}
              <div className="mb-4">
                <a
                  href="tel:+213778461682"
                  className="d-flex align-items-center justify-content-center text-primary mb-2"
                  style={{ fontSize: '2.5rem', textDecoration: 'none' }}
                >
                  <i className="fas fa-phone-alt"></i>
                </a>
                <h5 className="mb-1">
                  <a href="tel:+213778461682" className="text-primary" style={{ fontSize: '1.5rem', textDecoration: 'none' }}>
                    +213 778 461 682
                  </a>
                </h5>
                <p className="text-muted">Give us a call</p>
              </div>

              {/* Address */}
              <div>
                <i className="fas fa-map-marker-alt text-danger" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2 mb-0" style={{ fontSize: '1.2rem' }}>
                  Medea, Aindhab, Algeria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Hover animation */}
      <style>
        {`
          a:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </section>
  );
};

export default Contact;
