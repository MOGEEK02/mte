import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Info, X, Play } from "lucide-react";
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

const PortfolioCard = ({ item, setLightbox }: { item: PortfolioItem; setLightbox: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sortedMedia = [...(item.portfolio_media || [])].sort((a, b) => a.sort_order - b.sort_order);

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prev: number) => (prev + 1) % sortedMedia.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev: number) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Format Date uniquely
  const formattedDate = new Date(item.created_at).toLocaleDateString("fr-FR", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Hashtag Styling Logic
  const renderDescription = (text: string) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return <span key={index} className="text-[#00376b] font-medium hover:opacity-80 transition-opacity">{word}</span>;
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <article className="bg-white border border-slate-200 rounded-[3px] sm:rounded-xl shadow-sm mb-10 w-full max-w-[560px] mx-auto overflow-hidden text-sm">
      {/* Header - Instagram Style */}
      <header className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
            <img src="/images/logo.png" alt="MTE Algérie" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-slate-900 leading-tight">MTE Algérie</span>
          </div>
        </div>
      </header>

      {/* Media Carousel - Square/Vertical aspect ratio like IG */}
      <div 
        className="relative w-full bg-slate-950 flex items-center justify-center text-white aspect-[4/5] sm:aspect-square"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {sortedMedia.length > 0 ? (
          <div className="absolute inset-0 w-full h-full">
            {sortedMedia.map((media, idx) => (
              <div 
                key={media.id} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                {media.media_type === "image" ? (
                  <img
                    src={media.media_url}
                    alt={`${item.title} - ${idx + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setLightbox({ mediaList: sortedMedia, currentIndex: idx })}
                  />
                ) : (
                  getYouTubeId(media.media_url) ? (
                    <div className="w-full h-full relative cursor-zoom-in" onClick={() => setLightbox({ mediaList: sortedMedia, currentIndex: idx })}>
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(media.media_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.media_url)}&controls=0&modestbranding=1&playsinline=1`}
                        className="w-full h-full pointer-events-none"
                        style={{ border: "none" }}
                        allow="autoplay; encrypted-media"
                        tabIndex={-1}
                      />
                      <div className="absolute inset-0 z-10 bg-transparent"></div> {/* Intercepts clicks */}
                    </div>
                  ) : (
                    <video
                      src={media.media_url}
                      className="w-full h-full object-cover cursor-zoom-in"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onClick={() => setLightbox({ mediaList: sortedMedia, currentIndex: idx })}
                    />
                  )
                )}
              </div>
            ))}

            {/* Sweep Navigation Controls */}
            {sortedMedia.length > 1 && (
              <>
                <button 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
                
                {/* Image Counter (Instagram Top Right subtle display) */}
                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
                  {currentIndex + 1} / {sortedMedia.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <Info size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Média non disponible</span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-3 sm:p-4">
        {/* SEO Semantic Caption & Title */}
        <div className="mb-2 flex flex-col gap-1">
           <h3 className="text-base font-bold text-slate-900 leading-tight">{item.title}</h3>
           <p className="text-sm text-slate-800 break-words leading-relaxed whitespace-pre-wrap">
              {renderDescription(item.description)}
           </p>
        </div>
        
        {/* Date & Action Row */}
        <div className="flex items-center justify-between mt-3 mb-1">
          <div className="text-[10px] sm:text-[11px] uppercase text-slate-500 font-medium tracking-wide">
            {formattedDate}
          </div>
          
          <Link 
            to={`/portfolio/${item.id}`} 
            className="flex items-center gap-1.5 text-[#1a1a2e] hover:text-[#ff6600] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-link"></i> Partager / Voir
          </Link>
        </div>
      </div>
      
      {/* Dot Indicators at very bottom mimicking IG (optional, often shown above caption) */}
      {sortedMedia.length > 1 && (
        <div className="w-full flex justify-center gap-1.5 pb-4">
          {sortedMedia.map((_, idx) => (
            <div 
              key={idx}
              className={`h-[4px] rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-orange-500 w-4" : "bg-slate-200 w-[4px]"}`}
            />
          ))}
        </div>
      )}
    </article>
  );
};

const PortfolioNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2 sm:py-3" : "bg-transparent py-4 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative z-50">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <img 
              src={isScrolled ? "/images/logo.png" : "/images/logo%20white.png"} 
              alt="MTE Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Menu - Mirrored from Home Page Template */}
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

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown */}
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
  const [lightbox, setLightbox] = useState<{ mediaList: MediaItem[]; currentIndex: number } | null>(null);

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
      <PortfolioNavbar />

      {/* Hero Header exactly like Home Page Slider */}
      <section 
        className="text-left text-white min-h-[50vh] sm:min-h-[60vh] flex items-center relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backg.png)" }}
      >
        <div className="absolute inset-0 bg-[#1a1a2e]/85 backdrop-blur-[2px]"></div>
        <div className="max-w-7xl w-full mx-auto px-4 relative z-10 pt-32 pb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
               Mes <span className="text-[#f5a623]">Réalisations</span>
            </h2>
            <p className="text-[15px] sm:text-lg text-white/90 font-light max-w-xl leading-relaxed">
              Découvrez mes interventions et mon expertise en réparation électronique industrielle en Algérie.
            </p>
          </div>
        </div>
      </section>

      <main className="pt-8 sm:pt-14 pb-20 px-0 sm:px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 mt-10">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
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
          <div className="flex flex-col items-center">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} setLightbox={setLightbox} />
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Lightbox & Media Modal */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out p-2 sm:p-6 animate-in fade-in duration-200"
        >
          {(() => {
            const currentMedia = lightbox.mediaList[lightbox.currentIndex];
            const isYouTube = getYouTubeId(currentMedia.media_url);
            const type = currentMedia.media_type === "image" ? "image" : isYouTube ? "youtube" : "video";

            const handlePrev = (e: React.MouseEvent) => {
              e.stopPropagation();
              setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex - 1 + lightbox.mediaList.length) % lightbox.mediaList.length });
            };
            const handleNext = (e: React.MouseEvent) => {
              e.stopPropagation();
              setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex + 1) % lightbox.mediaList.length });
            };

            return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {type === "image" && (
                  <img
                    key={currentMedia.media_url} // Forces animation re-trigger on swap
                    src={currentMedia.media_url}
                    alt="Vue agrandie"
                    className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain animate-in zoom-in-95 duration-200 mb-16 sm:mb-24"
                  />
                )}

                {type === "video" && (
                  <video
                    key={currentMedia.media_url} 
                    src={currentMedia.media_url}
                    autoPlay
                    controls
                    className="w-full h-auto max-w-5xl max-h-[75vh] sm:max-h-[80vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200 cursor-auto mb-16 sm:mb-24"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {type === "youtube" && (
                  <div 
                    key={currentMedia.media_url}
                    className="w-full max-w-5xl aspect-[16/9] bg-black rounded-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 cursor-auto mb-16 sm:mb-24" 
                    onClick={(e) => e.stopPropagation()}
                  >
                     <iframe
                       src={`https://www.youtube.com/embed/${getYouTubeId(currentMedia.media_url)}?autoplay=1&rel=0`}
                       className="w-full h-full"
                       allow="autoplay; fullscreen"
                       allowFullScreen
                     />
                  </div>
                )}

                {/* Sweep Controls inside Gallery */}
                {lightbox.mediaList.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-[calc(50%+2rem)] w-10 h-10 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/80 border border-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer z-50"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-[calc(50%+2rem)] w-10 h-10 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/80 border border-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer z-50"
                    >
                      <ChevronRight size={28} />
                    </button>

                    {/* Thumbnail Strip at bottom */}
                    <div 
                      className="absolute bottom-4 sm:bottom-6 left-0 w-full flex justify-center gap-2 sm:gap-3 px-4 z-50 overflow-x-auto scroolbar-hide"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {lightbox.mediaList.map((m, i) => {
                        const isYTVid = getYouTubeId(m.media_url);
                        return (
                          <div 
                            key={m.id}
                            onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, currentIndex: i }) }}
                            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                              i === lightbox.currentIndex 
                                ? "ring-2 ring-orange-500 scale-110 opacity-100 shadow-xl" 
                                : "ring-1 ring-white/20 opacity-40 hover:opacity-100"
                            }`}
                          >
                            {m.media_type === "image" ? (
                              <img src={m.media_url} className="w-full h-full object-cover" />
                            ) : isYTVid ? (
                              <img src={`https://img.youtube.com/vi/${isYTVid}/0.jpg`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50">
                                <Play size={24} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/80 border border-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-[10000]"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
