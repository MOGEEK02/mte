import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Info, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "./footer";
import {
  getOptimizedImageUrl,
  isImageMedia,
  isVideoMedia,
  FALLBACK_IMAGE,
} from "../utils/imageOptimizer";


/* ─────────────────────────── Types ─────────────────────────── */

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


/* ─────────────────────── YouTube helper ───────────────────── */

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}


/* ─────────────────────── PublicationCard ──────────────────── */

const PublicationCard = ({ item }: { item: PortfolioItem }) => {
  const [mediaIdx, setMediaIdx] = useState(0);

  const sortedMedia = [...(item.portfolio_media || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const currentMedia = sortedMedia.length > 0 ? sortedMedia[mediaIdx] : null;
  const ytId = currentMedia ? getYouTubeId(currentMedia.media_url) : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((p) => (p - 1 + sortedMedia.length) % sortedMedia.length);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((p) => (p + 1) % sortedMedia.length);
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hashtags =
    (item.description || "").match(/#[a-zA-Z0-9_\u0600-\u06FF]+/g) || [];
  const cleanDescription = (item.description || "")
    .replace(/#[a-zA-Z0-9_\u0600-\u06FF]+/g, "")
    .trim();

  const isVideo =
    currentMedia && isVideoMedia(currentMedia.media_url, currentMedia.media_type);
  const isImage =
    currentMedia && isImageMedia(currentMedia.media_url, currentMedia.media_type);

  return (
    /* Separator between items — last child gets no bottom border */
    <article className="py-10 sm:py-14 border-b border-slate-100 last:border-b-0">
      <Link
        to={`/portfolio/${item.id}`}
        className="flex flex-col md:flex-row gap-8 lg:gap-14 xl:gap-16 group"
      >

        {/* ── LEFT: Media (16:9 forced, object-cover) ────────── */}
        <div className="w-full md:w-[54%] shrink-0">
          <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden">

            {currentMedia ? (
              <>
                {/* ① Regular image */}
                {isImage && !ytId && (
                  <img
                    src={getOptimizedImageUrl(currentMedia.media_url, 1400)}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                )}

                {/* ② YouTube thumbnail */}
                {ytId && (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        // fallback to hqdefault if maxres doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="text-white w-7 h-7 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ③ Native / hosted video */}
                {isVideo && !ytId && (
                  <div className="relative w-full h-full">
                    <video
                      src={currentMedia.media_url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      muted
                      playsInline
                      loop
                      autoPlay
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="text-white w-7 h-7 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-left media-type badge */}
                <div className="absolute top-3 left-3 z-20 px-2.5 py-[4px] bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-[0.1em] uppercase pointer-events-none select-none">
                  {isVideo ? "🎬 Vidéo" : `📸 ${sortedMedia.length} photo${sortedMedia.length > 1 ? "s" : ""}`}
                </div>

                {/* Carousel controls — only when multiple media */}
                {sortedMedia.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Précédent"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-[#ff6600] text-white flex items-center justify-center backdrop-blur-sm transition-colors duration-200 pointer-events-auto"
                    >
                      <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Suivant"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-[#ff6600] text-white flex items-center justify-center backdrop-blur-sm transition-colors duration-200 pointer-events-auto"
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
                      {sortedMedia.map((_, i) => (
                        <span
                          key={i}
                          className={`block h-[3px] rounded-full transition-all duration-300 ${i === mediaIdx
                            ? "w-5 bg-[#ff6600]"
                            : "w-2 bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* No media placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 select-none">
                <Info size={36} className="opacity-20 mb-2" />
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-slate-400">
                  Aucun média
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Content ──────────────────────────────────── */}
        <div className="w-full md:w-[46%] flex flex-col justify-center">

          {/* Title */}
          <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold text-[#0d0d0d] tracking-wide uppercase leading-snug mb-5 group-hover:text-[#ff6600] transition-colors duration-300">
            {item.title}
          </h2>

          {/* Hairline rule — visual hierarchy anchor */}
          <div className="w-full h-px bg-slate-200 mb-5" />

          {/* Description */}
          {cleanDescription && (
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-[1.85] mb-5 line-clamp-5 font-normal">
              {cleanDescription}
            </p>
          )}

          {/* Hashtag chips */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {hashtags.slice(0, 5).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2.5 py-[5px] bg-slate-50 border border-slate-200 text-slate-600 tracking-[0.07em] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata footer */}
          <div className="mt-auto pt-5 border-t border-slate-100">
            <p className="text-[13px] text-slate-500 mb-3">
              <span className="font-bold text-slate-800 mr-1">
                Date d&apos;intervention :
              </span>
              {formattedDate}
            </p>

            {/* CTA */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ff6600] tracking-[0.12em] uppercase group-hover:gap-3 transition-all duration-200">
              Consulter le projet
              <span className="text-sm leading-none">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};


/* ─────────────────────── PortfolioNavbar ──────────────────── */

export const PortfolioNavbar = ({ alwaysWhite = false }: { alwaysWhite?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(alwaysWhite);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysWhite) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysWhite]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled
        ? "bg-white shadow-sm py-2 sm:py-3"
        : "bg-transparent py-4 sm:py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative z-50">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={isScrolled ? "/images/logo.png" : "/images/logo%20white.png"}
              alt="MTE Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-slate-700 hover:text-[#ff6600]" : "text-white/85 hover:text-white"
                }`}
            >
              Accueil
            </Link>
            <Link
              to="/portfolio"
              className="text-sm font-bold text-[#ff6600]"
            >
              Portfolio
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden transition-colors duration-300 ${isScrolled || isMobileMenuOpen ? "text-slate-900" : "text-white"
              }`}
          >
            {isMobileMenuOpen ? (
              <X size={26} />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen
          ? "translate-y-0 opacity-100 pt-24 pb-10"
          : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-medium text-slate-800"
          >
            Accueil
          </Link>
          <Link
            to="/portfolio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-[#ff6600]"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </nav>
  );
};


/* ──────────────────────── Portfolio page ─────────────────── */

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

      if (!error) setItems(data || []);
      setLoading(false);
    }
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Portfolio des Réparations | MTE Électronique Industrielle Algérie</title>
        <meta
          name="description"
          content="Découvrez nos interventions, maintenances et succès en réparation de cartes électroniques, variateurs de fréquence, automates et équipements industriels partout en Algérie."
        />
        <meta
          name="keywords"
          content="Portfolio MTE, réparation électronique industrielle Algérie, maintenance variateur, réparation cartes électroniques industrielles, automates programmables, IHM"
        />
        <link rel="canonical" href="https://moutie.vercel.app/portfolio" />
        <meta property="og:title" content="Portfolio des Réparations | MTE Algérie" />
        <meta
          property="og:description"
          content="Explorez notre galerie de réparations électroniques pour l'industrie algérienne."
        />
      </Helmet>

      <PortfolioNavbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="text-left text-white min-h-[45vh] sm:min-h-[55vh] flex items-center relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backg.png)" }}
      >
        <div className="absolute inset-0 bg-[#1a1a2e]/85 backdrop-blur-[2px]" />
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-10 relative z-10 pt-28 pb-14">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
              Mes{" "}
              <span className="text-[#f5a623]">Réalisations</span>
            </h1>
            <p className="text-[15px] sm:text-lg text-white/80 font-light max-w-xl leading-relaxed">
              Interventions et expertise en réparation électronique industrielle
              à travers toute l&apos;Algérie.
            </p>
          </div>
        </div>
      </section>

      {/* ── Item list ─────────────────────────────────────────── */}
      <main className="pt-6 pb-24 px-5 sm:px-8 lg:px-10 max-w-6xl mx-auto">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-9 h-9 text-[#ff6600] animate-spin mb-4" />
            <p className="text-slate-400 text-[11px] font-semibold tracking-[0.18em] uppercase animate-pulse">
              Chargement...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Info className="w-7 h-7 text-slate-300" />
            </div>
            <h4 className="text-base font-bold text-slate-700 mb-2">
              Aucune réalisation pour le moment
            </h4>
            <p className="text-slate-400 text-sm">
              Revenez bientôt pour découvrir nos dernières interventions.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && items.length > 0 && (
          <div className="w-full">
            {items.map((item) => (
              <PublicationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
