import React, { useState, useEffect } from "react";

const HomePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="header_area">
        <div className={`header_navbar ${isScrolled ? "scrolled" : ""}`}>
          <div className="container">
            <div className="row align-items-center">
              {/* Logo */}
              <div className="col-lg-2 col-6">
                <nav className="navbar navbar-expand-lg">
                  <a className="navbar-brand" href="/">
                    <img
                      src={
                        isScrolled
                          ? "/images/logo.png"
                          : "/images/logo white.png"
                      }
                      alt="Logo"
                    />
                  </a>
                </nav>
              </div>

              {/* Navigation Menu */}
              <div className="col-lg-10 col-6">
                <nav className="navbar navbar-expand-lg justify-content-end">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div id="navbarNav" className="font-bold">
                    <ul className="navbar-nav ms-auto">
                      <li className="nav-item">
                        <a className="nav-link active" href="#home">
                          Home
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#about">
                          About Me
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#services">
                          Services
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#contact">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Header Slider */}
        <div id="home" className="header_slider">
          <div
            className="single_slider bg_cover d-flex align-items-center"
            style={{ backgroundImage: "url(/images/backg.png)" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-7">
                  <div className="slider_content">
                    <h2
                      className="slider_title wow fadeInLeftBig"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.2s"
                    >
                      Industrial Electronic repair <span>Service</span>
                    </h2>
                    <p
                      className="wow fadeInLeftBig"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.5s"
                    >
                      We provide the best solutions for your business
                    </p>
                    <a
                      href="#contact"
                      className="main-btn wow fadeInLeftBig"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.8s"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;