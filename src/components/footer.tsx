import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* About / Company */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold mb-3 text-warning">About Us</h5>
            <p>
              We provide professional electronics, automation, and industrial solutions. Connect with us for high-quality service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold mb-3 text-warning">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="#services" className="text-light text-decoration-none">Services</a></li>
              <li><a href="#about" className="text-light text-decoration-none">About</a></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="col-md-4 mb-4 text-center text-md-start">
            <h5 className="text-uppercase fw-bold mb-3 text-warning">Connect</h5>
            <div className="d-flex gap-3 mb-3 justify-content-center justify-content-md-start pl-90">
              <a href="https://github.com/MOGEEK02" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://facebook.com/mogeek02" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <i className="fab fa-facebook"></i>
              </a>

              <a href="https://instagram.com/mooutiem" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/moutie/" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://wa.me/213778461682" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>

            <p className="mb-1">
              <i className="fas fa-phone-alt me-2"></i> +213 778 461 682
            </p>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i> Medea, Aindhab, Algeria
            </p>
          </div>
        </div>

        <hr className="bg-light" />

        {/* Copyright */}
        <div className="text-center mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} MTE. All rights reserved.</p>
        </div>
      </div>

      <style>
        {`
          a:hover {
            color: #ff6600 !important;
            transform: scale(1.2);
            transition: 0.3s;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
