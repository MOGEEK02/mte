import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
  portfolio_media: MediaItem[];
}

interface MediaItem {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  sort_order: number;
}

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ url: string; type: string } | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      const { data, error } = await supabase
        .from("portfolio")
        .select(`
          id, title, description, created_at,
          portfolio_media ( id, media_url, media_type, sort_order )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolio:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }
    fetchPortfolio();
  }, []);

  return (
    <>
      {/* Navbar for Portfolio page */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src="/images/logo white.png"
              alt="MTE Logo"
              style={{ height: "40px" }}
            />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/"
              className="text-white text-decoration-none fw-medium"
              style={{ opacity: 0.8 }}
            >
              Accueil
            </Link>
            <span className="text-warning fw-bold">Portfolio</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          marginTop: "-1px",
        }}
      >
        <div className="container">
          <h2
            className="display-4 fw-bold mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Nos <span style={{ color: "#f5a623" }}>Réalisations</span>
          </h2>
          <p className="lead" style={{ opacity: 0.8, maxWidth: 600, margin: "0 auto" }}>
            Découvrez nos projets de réparation et maintenance électronique
            industrielle en Algérie.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-5" style={{ background: "#f8f9fa", minHeight: "70vh" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3 text-muted fw-bold">Chargement de nos projets...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="fas fa-folder-open mb-3"
                style={{ fontSize: "5rem", color: "#dcdde1" }}
              ></i>
              <h4 className="text-muted fw-bold">Aucun projet trouvé</h4>
              <p className="text-muted">Revenez bientôt pour découvrir nos dernières réparations.</p>
            </div>
          ) : (
            <div className="row g-5">
              {items.map((item) => {
                const sortedMedia = [
                  ...(item.portfolio_media || []),
                ].sort((a, b) => a.sort_order - b.sort_order);

                return (
                  <div key={item.id} className="col-12 col-lg-6">
                    <div
                      className="card h-100 border-0 shadow"
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        transition: "all 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 1rem 3rem rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 .5rem 1rem rgba(0,0,0,0.15)";
                      }}
                    >
                      {/* Media Carousel */}
                      {sortedMedia.length > 0 && (
                        <div
                          id={`carousel-${item.id}`}
                          className="carousel slide"
                          data-bs-ride="carousel"
                          data-bs-interval="3000"
                        >
                          <div className="carousel-inner" style={{ backgroundColor: "#000" }}>
                            {sortedMedia.map((media, idx) => (
                              <div
                                key={media.id}
                                className={`carousel-item ${idx === 0 ? "active" : ""}`}
                              >
                                {media.media_type === "image" ? (
                                  <div style={{ paddingBottom: "65%", position: "relative" }}>
                                    <img
                                      src={media.media_url}
                                      alt={`${item.title} – photo ${idx + 1}`}
                                      className="position-absolute top-0 start-0 w-100 h-100"
                                      style={{
                                        objectFit: "contain",
                                        backgroundColor: "#f8f9fa",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setLightbox({
                                          url: media.media_url,
                                          type: "image",
                                        })
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div style={{ paddingBottom: "65%", position: "relative" }}>
                                    {getYouTubeId(media.media_url) ? (
                                      <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(media.media_url)}`}
                                        title={item.title}
                                        className="position-absolute top-0 start-0 w-100 h-100"
                                        style={{ border: "none" }}
                                        allowFullScreen
                                      />
                                    ) : (
                                      <video
                                        src={media.media_url}
                                        className="position-absolute top-0 start-0 w-100 h-100"
                                        style={{ objectFit: "contain", backgroundColor: "#000" }}
                                        controls
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Controls & Indicators */}
                          {sortedMedia.length > 1 && (
                            <>
                              <div className="carousel-indicators mb-2">
                                {sortedMedia.map((_, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    data-bs-target={`#carousel-${item.id}`}
                                    data-bs-slide-to={idx}
                                    className={idx === 0 ? "active" : ""}
                                    aria-current={idx === 0 ? "true" : "false"}
                                    aria-label={`Slide ${idx + 1}`}
                                  ></button>
                                ))}
                              </div>
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target={`#carousel-${item.id}`}
                                data-bs-slide="prev"
                                style={{ width: "10%" }}
                              >
                                <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}></span>
                                <span className="visually-hidden">Précédent</span>
                              </button>
                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target={`#carousel-${item.id}`}
                                data-bs-slide="next"
                                style={{ width: "10%" }}
                              >
                                <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}></span>
                                <span className="visually-hidden">Suivant</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Card Body */}
                      <div className="card-body p-5">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h4 className="card-title fw-bolder mb-0" style={{ color: "#1a1a2e" }}>
                            {item.title}
                          </h4>
                          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                            <i className="fas fa-check-circle me-1"></i> Réalisé
                          </span>
                        </div>
                        <p className="card-text text-secondary fs-6 mb-4" style={{ lineHeight: "1.7" }}>
                          {item.description}
                        </p>
                        <hr className="text-muted opacity-25" />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="text-secondary small fw-medium">
                            <i className="far fa-calendar-alt text-warning me-2"></i>
                            {new Date(item.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-secondary small fw-medium">
                             MTE Algérie
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && lightbox.type === "image" && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox.url}
            alt="Vue agrandie"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer */}
      <footer
        className="text-center py-4"
        style={{
          background: "#1a1a2e",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} MTE – Réparation Électronique
            Industrielle. Tous droits réservés.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Portfolio;
