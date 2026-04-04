import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, Loader2, Info } from "lucide-react";
import { PortfolioNavbar } from "./Portfolio";
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

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function SinglePortfolioPost() {
  const { id } = useParams();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolio")
        .select("*, portfolio_media(*)")
        .eq("id", id)
        .single();
        
      if (!error && data) {
        setItem(data);
      }
      setLoading(false);
    }
    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#ff6600] animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Publication introuvable</h2>
        <Link to="/portfolio" className="text-[#ff6600] hover:underline font-medium">
           Retourner au portfolio
        </Link>
      </div>
    );
  }

  const sortedMedia = [...(item.portfolio_media || [])].sort((a, b) => a.sort_order - b.sort_order);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % sortedMedia.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
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
        return <span key={index} className="text-[#00376b] font-medium hover:opacity-80 transition-opacity">{word}</span>;
      }
      return <span key={index}>{word}</span>;
    });
  };

  // Construct absolute URL for canonical tagging
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : `https://moutie.vercel.app/portfolio/${item.id}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dynamic SEO Meta Tags for Search Engines */}
      <Helmet>
        <title>{item.title} | MTE Portfolio</title>
        <meta name="description" content={item.description.substring(0, 160)} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.description.substring(0, 160)} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {sortedMedia[0] && sortedMedia[0].media_type === 'image' && (
           <meta property="og:image" content={sortedMedia[0].media_url} />
        )}
      </Helmet>

      {/* Main Navigation */}
      <PortfolioNavbar alwaysWhite={true} />

      {/* Main Single Feed Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 mt-20">
        <article className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-sm">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex-shrink-0 bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                <img src="/images/logo.png" alt="MTE Algérie" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-semibold text-slate-900 text-base leading-tight">MTE Algérie</span>
                <span className="text-xs text-slate-500">{formattedDate}</span>
              </div>
            </div>
          </header>

          {/* Media Carousel */}
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
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      getYouTubeId(media.media_url) ? (
                        <div className="w-full h-full relative object-contain bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(media.media_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.media_url)}&controls=1`}
                            className="w-full h-full"
                            style={{ border: "none" }}
                            allow="autoplay; encrypted-media"
                          />
                        </div>
                      ) : (
                        <video
                          src={media.media_url}
                          className="w-full h-full object-contain bg-black"
                          controls
                        />
                      )
                    )}
                  </div>
                ))}

                {sortedMedia.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                    
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
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

          {/* Texts */}
          <div className="p-5 sm:p-6 bg-white shrink-0 h-auto border-t border-slate-100">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">{item.title}</h1>
            <p className="text-base sm:text-lg text-slate-800 break-words leading-relaxed whitespace-pre-wrap">
               {renderDescription(item.description)}
            </p>
          </div>
          
        </article>
      </main>
      <Footer />
    </div>
  );
}
