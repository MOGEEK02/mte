import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Info, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "./footer";

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

const MasonryCard = ({ item }: { item: PortfolioItem }) => {
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
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const renderDescription = (text: string) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return <span key={index} className="text-[#00376b] font-medium">{word}</span>;
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="h-full">
      <Link 
        to={`/portfolio/${item.id}`} 
        className="flex flex-col h-full bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-400 overflow-hidden group relative"
      >
        {/* Media Thumbnail */}
        {currentMedia ? (
          <div className="flex flex-col w-full shrink-0 relative">
            <div className="relative w-full aspect-[9/16] bg-slate-50 overflow-hidden shrink-0">
              {currentMedia.media_type === "image" ? (
                <img
                  src={currentMedia.media_url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  loading="lazy"
                />
              ) : getYouTubeId(currentMedia.media_url) ? (
                <img 
                  src={`https://img.youtube.com/vi/${getYouTubeId(currentMedia.media_url)}/hqdefault.jpg`}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  loading="lazy"
                />
              ) : (
                 <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:min-h-[300px] bg-slate-900 flex items-center justify-center overflow-hidden">
                   <video
                    src={currentMedia.media_url}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    muted playsInline loop autoPlay
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <Play className="text-white w-6 h-6 ml-1" fill="currentColor" />
                      </div>
                   </div>
                 </div>
              )}
              
              
              {/* Dot Indicators on Image */}
              {sortedMedia.length > 1 && (
                 <>
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {sortedMedia.map((_, i) => (
                        <div 
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === mediaIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                        />
                      ))}
                   </div>
                 </>
              )}
            </div>

            {/* Explicit Navigation Bar Below Media */}
            {sortedMedia.length > 1 && (
               <div className="bg-slate-50 border-b border-slate-100 p-3 sm:p-4 flex items-center justify-between w-full shrink-0">
                  <button 
                    onClick={handlePrev}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#ff6600] font-bold text-[13px] flex items-center gap-1.5 transition-all shadow-sm z-20 pointer-events-auto"
                  >
                    <ChevronLeft size={16} strokeWidth={3} /> Précédent
                  </button>
                  
                  <div className="text-[12px] font-extrabold text-slate-400 tracking-widest uppercase">
                    {mediaIdx + 1} / {sortedMedia.length}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#ff6600] font-bold text-[13px] flex items-center gap-1.5 transition-all shadow-sm z-20 pointer-events-auto"
                  >
                    Suivant <ChevronRight size={16} strokeWidth={3} />
                  </button>
               </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-square bg-slate-50 flex flex-col items-center justify-center text-slate-300">
             <Info size={32} className="mb-2 opacity-40" />
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-5 sm:p-6 text-left">
          <h3 className="text-[17px] sm:text-[19px] font-extrabold text-slate-900 leading-tight mb-2.5 group-hover:text-[#ff6600] transition-colors duration-300 line-clamp-2 shrink-0">
            {item.title}
          </h3>
          
          <p className="text-[13px] sm:text-[14px] text-slate-500 line-clamp-2 leading-relaxed mb-5 whitespace-pre-wrap font-medium flex-grow">
             {renderDescription(item.description)}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 mt-auto shrink-0">
            <time dateTime={item.created_at} className="text-[11px] uppercase text-slate-400 font-bold tracking-widest">
              {formattedDate}
            </time>
            <span className="flex items-center gap-1 text-[#ff6600] text-[12px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              Voir <ChevronRight size={14} strokeWidth={3} />
            </span>
          </div>
        </div>
      </Link>
    </div>
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

      <main className="pt-8 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
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
          <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-md mx-auto">
            {items.map((item) => (
              <MasonryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
