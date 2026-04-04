import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";

const navLabels: Record<string, string> = {
  home: "Accueil",
  about: "À Propos",
  services: "Services",
  contact: "Contact",
};

const HomePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [resumeLinks, setResumeLinks] = useState({ en: "", fr: "" });

  useEffect(() => {
    async function fetchResume() {
      const { data, error } = await supabase.from("resume_links").select("*").single();
      if (!error && data) {
        setResumeLinks({ en: data.url_en || "", fr: data.url_fr || "" });
      }
    }
    fetchResume();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

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
                          ? "images/logo.png"
                          : "images/logo white.png"
                      }
                      alt="MTE – Réparation électronique industrielle en Algérie"
                    />
                  </a>
                </nav>
              </div>

              {/* Menu de navigation */}
              <div className="col-lg-10 col-6">
                <nav className="navbar navbar-expand-lg justify-content-end">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Ouvrir le menu"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div className="" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                      {Object.entries(navLabels).map(([sec, label]) => (
                        <li className="nav-item" key={sec}>
                          <a
                            className={`nav-link ${
                              activeSection === sec
                                ? "text-warning fw-bold"
                                : isScrolled
                                ? "text-dark"
                                : "text-white"
                            }`}
                            href={`#${sec}`}
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isScrolled ? "text-dark" : "text-white"}`}
                          to="/portfolio"
                        >
                          Portfolio
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Slider d'en-tête */}
        <div id="home" className="header_slider">
          <div
            className="single_slider bg_cover d-flex align-items-center"
            style={{ backgroundImage: "url(images/backg.png)" }}
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
                      Réparation Électronique <span>Industrielle</span>
                    </h2>
                    <p
                      className="wow fadeInLeftBig"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.5s"
                    >
                      Nous offrons les meilleures solutions pour votre entreprise
                    </p>
                    <div 
                      className="d-flex flex-wrap gap-3 mt-4 wow fadeInLeftBig" 
                      data-wow-duration="1.3s" 
                      data-wow-delay="0.8s"
                    >
                      <a href="#contact" className="main-btn">
                        Contactez-nous
                      </a>
                      <Link to="/portfolio" className="main-btn" style={{ backgroundColor: "#2d3748", border: "1px solid #2d3748" }}>
                        Mon Portfolio
                      </Link>
                      {resumeLinks.fr && (
                        <a href={resumeLinks.fr} target="_blank" rel="noopener noreferrer" className="main-btn" style={{ backgroundColor: "transparent", border: "2px solid white", color: "white" }}>
                           Télécharger CV (FR)
                        </a>
                      )}
                      {resumeLinks.en && (
                        <a href={resumeLinks.en} target="_blank" rel="noopener noreferrer" className="main-btn" style={{ backgroundColor: "transparent", border: "2px solid white", color: "white" }}>
                           Télécharger CV (EN)
                        </a>
                      )}
                    </div>
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
