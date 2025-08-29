import React, { useState, useEffect } from "react";

const HomePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ["home", "about", "services", "contact"];
      const scrollPos = window.scrollY + 200;

      for (let sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="header_area">
        {/* Navbar */}
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
                          ? "mte/images/logo.png"
                          : "mte/images/logo white.png"
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

                  <div className="" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                      {["home", "about", "services", "contact"].map((sec) => (
                        <li className="nav-item" key={sec}>
                          <a
                            className={`nav-link ${
                              activeSection === sec
                                ? "text-warning fw-bold" // active link yellow
                                : isScrolled
                                ? "text-dark"
                                : "text-white"
                            }`}
                            href={`#${sec}`}
                          >
                            {sec.charAt(0).toUpperCase() + sec.slice(1)}
                          </a>
                        </li>
                      ))}
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
            style={{ backgroundImage: "url(mte/images/backg.png)" }}
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
