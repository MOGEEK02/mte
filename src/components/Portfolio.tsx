import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Info, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "./footer";
import { getOptimizedImageUrl, isImageMedia, isVideoMedia, FALLBACK_IMAGE } from "../utils/imageOptimizer";


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

const PublicationCard = ({ item, index }: { item: PortfolioItem; index: number }) => {
  const [mediaIdx, setMediaIdx] = useState(0);
  const sortedMedia = [...(item.portfolio_media || [])].sort((a, b) => a.sort_order - b.sort_order);
  const currentMedia = sortedMedia.length > 0 ? sortedMedia[mediaIdx] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((prev) => (prev + 1) % sortedMedia.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Extract hashtags from description
  const hashtags = (item.description || "").match(/#[a-zA-Z0-9_\u0600-\u06FF]+/g) || [];
  const cleanDescription = (item.description || "").replace(/#[a-zA-Z0-9_\u0600-\u06FF]+/g, "").trim();

  // Alternating background: bg-gray-100 and white
  const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";

  return (
    <article className="w-full">
      <Link 
        to={`/portfolio/${item.id}`} 
        className={`w-full rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer flex flex-col md:flex-row border border-slate-200/80 group ${bgColor}`}
      >
        {/* Media Column (Left - 16:9 Aspect Ratio) */}
        <div className="w-full md:w-1/2 aspect-video bg-black relative shrink-0 overflow-hidden flex items-center justify-center">
          {currentMedia ? (
            <>
              {isImageMedia(currentMedia.media_url, currentMedia.media_type) ? (
                <img
                  src={getOptimizedImageUrl(currentMedia.media_url, 1000)}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : getYouTubeId(currentMedia.media_url) ? (
                <div className="relative w-full h-full">
                  <img 
                    src={`https://img.youtube.com/vi/${getYouTubeId(currentMedia.media_url)}/hqdefault.jpg`}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="text-white w-6 h-6 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                  <video
                    src={currentMedia.media_url}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    muted
                    playsInline
                    loop
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#ff6600]/90 rounded-full flex items-center justify-center shadow-xl">
                      <Play className="text-white w-6 h-6 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}

              {/* Media Type Badge */}
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm pointer-events-none">
                {isVideoMedia(currentMedia.media_url, currentMedia.media_type) ? (
                  <span>🎬 Vidéo</span>
                ) : (
                  <span>📸 {sortedMedia.length} {sortedMedia.length > 1 ? "photos" : "photo"}</span>
                )}
              </div>

              {/* Slide controls when multiple media items */}
              {sortedMedia.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    aria-label="Précédent"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-[#ff6600] text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-all pointer-events-auto"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={handleNext}
                    aria-label="Suivant"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-[#ff6600] text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-all pointer-events-auto"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
                    {sortedMedia.map((_, i) => (
                      <div 
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === mediaIdx ? "w-5 bg-[#ff6600]" : "w-1.5 bg-white/70"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Info size={36} className="opacity-40 mb-2" />
              <span className="text-xs">Photo non disponible</span>
            </div>
          )}
        </div>

        {/* Content Column (Right) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-left">
          <div>
            {/* Title (Uppercase bold matching the reference) */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-wide uppercase leading-tight mb-3 group-hover:text-[#ff6600] transition-colors">
              {item.title}
            </h2>

            {/* Horizontal Line Divider */}
            <hr className="w-full border-t border-slate-300/80 mb-4" />

            {/* Description */}
            {cleanDescription && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal whitespace-pre-wrap line-clamp-4">
                {cleanDescription}
              </p>
            )}

            {/* Hashtag Badges */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {hashtags.slice(0, 4).map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Footer matching reference */}
          <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 mt-4">
            <div>
              <span className="font-bold text-slate-700">Date d'intervention : </span>
              <span>{formattedDate}</span>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-[#ff6600] group-hover:translate-x-1 transition-transform">
              Consulter le projet →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export const PortfolioNavbar = ({ alwaysWhite = false }: { alwaysWhite?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(alwaysWhite);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysWhite) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysWhite]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2 sm:py-3" : "bg-transparent py-4 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative z-50">
          <Link to="/" className="flex-shrink-0 transition-transform">
            <img 
              src={isScrolled ? "/images/logo.png" : "/images/logo%20white.png"} 
              alt="MTE Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300"
            />
          </Link>

          <div className="hidden md:block">
            <ul className="navbar-nav d-flex flex-row gap-4 mb-0 align-items-center">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link fs-6 transition-all duration-300 ${isScrolled ? "text-dark" : "text-white"}`}
                >
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/portfolio"
                  className="nav-link fs-6 text-warning fw-bold"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                isScrolled || isMobileMenuOpen ? "text-slate-900" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden absolute top-0 left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? "translate-y-0 opacity-100 h-auto pt-24 pb-8" : "-translate-y-full opacity-0 h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <ul className="navbar-nav w-100 text-center space-y-4">
            <li className="nav-item">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link fs-4 text-dark"
              >
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link fs-4 text-warning fw-bold"
              >
                Portfolio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      const { data, error } = await supabase
        .from("portfolio")
        .select(`
          id, title, description, created_at,
          portfolio_media ( id, media_url, media_type, sort_order )
        `)
        .order("created_at", { ascending: false });

      if (!error) {
        setItems(data || []);
      }
      setLoading(false);
    }
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet>
        <title>Portfolio des Réparations | MTE Électronique Industrielle Algérie</title>
        <meta name="description" content="Découvrez nos interventions, maintenances et succès en réparation de cartes électroniques, variateurs de fréquence, automates et équipements industriels partout en Algérie." />
        <meta name="keywords" content="Portfolio MTE, réparation électronique industrielle Algérie, maintenance variateur, réparation cartes électroniques industrielles, automates programmables, IHM" />
        <link rel="canonical" href="https://moutie.vercel.app/portfolio" />
        <meta property="og:title" content="Portfolio des Réparations | MTE Algérie" />
        <meta property="og:description" content="Explorez notre galerie de réparations électroniques pour l'industrie algérienne." />
      </Helmet>

      <PortfolioNavbar />

      <section 
        className="text-left text-white min-h-[45vh] sm:min-h-[55vh] flex items-center relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backg.png)" }}
      >
        <div className="absolute inset-0 bg-[#1a1a2e]/85 backdrop-blur-[2px]"></div>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
               Mes <span className="text-[#f5a623]">Réalisations</span>
            </h1>
            <h2 className="text-[15px] sm:text-lg text-white/90 font-light max-w-xl leading-relaxed">
              Découvrez mes interventions et mon expertise en réparation électronique industrielle en Algérie.
            </h2>
          </div>
        </div>
      </section>

      <main className="pt-8 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 mt-10">
            <Loader2 className="w-10 h-10 text-[#ff6600] animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse text-sm">Chargement des postes...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto mt-10">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Info className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Aucun poste pour le moment</h4>
            <p className="text-slate-500 text-sm">Revenez bientôt pour découvrir nos dernières réparations.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-12 w-full">
            {items.map((item, index) => (
              <PublicationCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
