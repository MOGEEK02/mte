import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Info, Loader2, X } from "lucide-react";
import Navbar from "./Navbar";
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

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden group h-full">
      {/* Media Top Section */}
      <div 
        className="relative w-full aspect-video bg-slate-900 flex-shrink-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {sortedMedia.length > 0 ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {sortedMedia.map((media, idx) => (
              <div 
                key={media.id} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                {media.media_type === "image" ? (
                  <img
                    src={media.media_url}
                    alt={`${item.title} - ${idx + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
                    onClick={() => setLightbox({ url: media.media_url, type: 'image' })}
                  />
                ) : (
                  getYouTubeId(media.media_url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(media.media_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.media_url)}&controls=0&modestbranding=1`}
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

            {/* Controls */}
            {sortedMedia.length > 1 && (
              <>
                <button 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {sortedMedia.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white w-4" : "bg-white/50 w-1.5"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <Info size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Aucun média</span>
          </div>
        )}
      </div>

      {/* Content Bottom Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
            {item.title}
          </h3>
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm whitespace-nowrap border border-orange-100">
            <CheckCircle size={12} />
            Réalisé
          </span>
        </div>
        
        <p className="text-slate-600 text-[15px] leading-relaxed mb-6 flex-grow whitespace-pre-line">
          {item.description}
        </p>
        
        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <Calendar size={14} className="text-orange-500" />
            {new Date(item.created_at).toLocaleDateString("fr-FR", {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
            MTE Algérie
          </span>
        </div>
      </div>
    </div>
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
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-center text-white py-16 -mt-px relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
             Nos <span className="text-[#f5a623]">Réalisations</span>
          </h2>
          <p className="text-lg text-white/80 font-light">
            Découvrez nos projets de réparation et de maintenance électronique industrielle en Algérie.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Chargement de nos projets...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Info className="w-16 h-16 text-slate-300 mb-4" />
            <h4 className="text-xl font-bold text-slate-700 mb-2">Aucun projet trouvé</h4>
            <p className="text-slate-500">Revenez bientôt pour découvrir nos dernières réparations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} setLightbox={setLightbox} />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && lightbox.type === "image" && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out p-4 animate-in fade-in duration-200"
        >
          <img
            src={lightbox.url}
            alt="Vue agrandie"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-200"
          />
          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
