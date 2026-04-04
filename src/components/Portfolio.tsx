import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreHorizontal, Loader2, Info, X } from "lucide-react";
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
    month: 'long'
  });

  return (
    <article className="bg-white border border-slate-200 rounded-[3px] sm:rounded-xl shadow-sm mb-10 w-full max-w-[470px] mx-auto overflow-hidden text-sm">
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
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
          <MoreHorizontal size={20} />
        </button>
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
                    onClick={() => setLightbox({ url: media.media_url, type: 'image' })}
                  />
                ) : (
                  getYouTubeId(media.media_url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(media.media_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.media_url)}&controls=0&modestbranding=1&playsinline=1`}
                      className="w-full h-full pointer-events-none"
                      style={{ border: "none" }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={media.media_url}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
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
        {/* Caption & Title */}
        <div className="mb-2">
           <span className="font-semibold text-slate-900 mr-2">MTE Algérie</span>
           <span className="text-slate-800 break-words leading-relaxed whitespace-pre-wrap">
              <span className="font-semibold">{item.title}</span> — {item.description}
           </span>
        </div>
        
        {/* Date */}
        <div className="text-[10px] sm:text-[11px] uppercase text-slate-500 font-medium tracking-wide mt-3 mb-1">
          {formattedDate}
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

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              to="/" 
              className={`font-semibold transition-colors duration-300 ${
                isScrolled ? "text-slate-600 hover:text-orange-500" : "text-white/80 hover:text-white"
              }`}
            >
              Accueil
            </Link>
            <span 
              className={`font-bold transition-colors duration-300 ${
                isScrolled ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-orange-400 border-b-2 border-orange-400 pb-1"
              }`}
            >
              Portfolio
            </span>
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
        <div className="flex flex-col items-center justify-center space-y-6">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-slate-600 hover:text-orange-500 transition-colors"
          >
            Accueil
          </Link>
          <span className="text-xl font-bold text-orange-500 border-b-2 border-orange-500 pb-1">
            Portfolio
          </span>
        </div>
      </div>
    </nav>
  );
};

export default function Portfolio() {
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

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-center text-white pt-32 sm:pt-40 pb-16 relative overflow-hidden -mt-px">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
             Nos <span className="text-[#f5a623]">Réalisations</span>
          </h2>
          <p className="text-[15px] sm:text-lg text-white/80 font-light max-w-2xl mx-auto">
            Découvrez nos interventions et notre expertise en réparation électronique industrielle en Algérie.
          </p>
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

      {/* Lightbox */}
      {lightbox && lightbox.type === "image" && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <img
            src={lightbox.url}
            alt="Vue agrandie"
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-200"
          />
          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
