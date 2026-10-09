import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Loader2, Info, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "./Header";
import Footer from "./footer";
import { supabase } from "../utils/supabase";
import { useLang } from "../i18n/LanguageProvider";
import { SITE, OG_IMAGE } from "../config";
import {
  getOptimizedImageUrl,
  isImageMedia,
  isVideoMedia,
  FALLBACK_IMAGE,
} from "../utils/imageOptimizer";

/* ─────────────────── Types ─────────────────── */

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

/* ─────────────────── Card ──────────────────── */

const PublicationCard = ({ item }: { item: PortfolioItem }) => {
  const { lang, t } = useLang();
  const [mediaIdx, setMediaIdx] = useState(0);

  const sortedMedia = [...(item.portfolio_media || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const currentMedia = sortedMedia.length > 0 ? sortedMedia[mediaIdx] : null;
  const ytId = currentMedia ? getYouTubeId(currentMedia.media_url) : null;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((p) => (p - 1 + sortedMedia.length) % sortedMedia.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMediaIdx((p) => (p + 1) % sortedMedia.length);
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const hashtags =
    (item.description || "").match(/#[a-zA-Z0-9_؀-ۿ]+/g) || [];
  const cleanDesc = (item.description || "")
    .replace(/#[a-zA-Z0-9_؀-ۿ]+/g, "")
    .trim();

  const isVideo =
    currentMedia && isVideoMedia(currentMedia.media_url, currentMedia.media_type);
  const isImage =
    currentMedia && isImageMedia(currentMedia.media_url, currentMedia.media_type);

  return (
    <article className="py-10 sm:py-14 border-b border-slate-100 last:border-b-0">
      <Link
        to={`/portfolio/${item.id}`}
        className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-0 group"
      >
        {/* LEFT — Media */}
        <div className="w-full md:w-[55%] shrink-0 md:pr-10 lg:pr-14">
          <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden rounded-xl">
            {currentMedia ? (
              <>
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

                {ytId && (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
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
                      <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="text-white w-7 h-7 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3 z-20 px-2.5 py-[5px] bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-[0.1em] uppercase pointer-events-none select-none rounded">
                  {isVideo
                    ? `🎬 ${t.portfolio.videoLabel}`
                    : `📸 ${sortedMedia.length} ${
                        sortedMedia.length > 1 ? t.portfolio.photos : t.portfolio.photo
                      }`}
                </div>

                {sortedMedia.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="‹"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-brand text-white flex items-center justify-center backdrop-blur-sm transition-colors duration-200 pointer-events-auto"
                    >
                      <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="›"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-brand text-white flex items-center justify-center backdrop-blur-sm transition-colors duration-200 pointer-events-auto"
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
                      {sortedMedia.map((_, i) => (
                        <span
                          key={i}
                          className={`block h-[3px] rounded-full transition-all duration-300 ${
                            i === mediaIdx ? "w-5 bg-brand" : "w-2 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <Info size={36} className="opacity-20" />
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase">
                  {t.portfolio.noMedia}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Text */}
        <div className="w-full md:w-[45%] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-ink tracking-wide uppercase leading-tight group-hover:text-brand transition-colors duration-300">
              {item.title}
            </h2>
            <div className="w-full h-px bg-slate-200" />
            {cleanDesc && (
              <p className="text-[13.5px] sm:text-[15px] text-slate-500 leading-[1.85] line-clamp-4">
                {cleanDesc}
              </p>
            )}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.slice(0, 5).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2.5 py-[5px] bg-slate-50 border border-slate-200 text-slate-600 tracking-[0.07em] uppercase rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-[12.5px] text-slate-500 mb-3">
              <span className="font-bold text-slate-700 mr-1">
                {t.portfolio.interventionDate}
              </span>
              {formattedDate}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand tracking-[0.12em] uppercase group-hover:gap-3 transition-all duration-200">
              {t.portfolio.viewProject}
              <span className="text-sm leading-none">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

/* ─────────────────── Page ──────────────────── */

export default function Portfolio() {
  const { t, dir } = useLang();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      const { data, error } = await supabase
        .from("portfolio")
        .select(
          `id, title, description, created_at,
           portfolio_media ( id, media_url, media_type, sort_order )`
        )
        .order("created_at", { ascending: false });
      if (!error) setItems(data || []);
      setLoading(false);
    }
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <html dir={dir} />
        <title>{t.portfolio.metaTitle}</title>
        <meta name="description" content={t.portfolio.metaDescription} />
        <link rel="canonical" href={`${SITE.baseUrl}/portfolio`} />
        <meta property="og:title" content={t.portfolio.metaTitle} />
        <meta property="og:description" content={t.portfolio.metaDescription} />
        <meta property="og:url" content={`${SITE.baseUrl}/portfolio`} />
        <meta property="og:image" content={OG_IMAGE} />
      </Helmet>

      <Header variant="inner" />

      {/* Hero */}
      <section
        className="text-left text-white min-h-[42vh] sm:min-h-[50vh] flex items-center relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backg.png)" }}
      >
        <div className="absolute inset-0 bg-ink/85" />
        <div className="container-mte relative z-10 pt-28 pb-14">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              {t.portfolio.heroTitle}{" "}
              <span className="text-amber">{t.portfolio.heroTitleAccent}</span>
            </h1>
            <p className="text-[15px] sm:text-lg text-white/80 font-light max-w-xl leading-relaxed">
              {t.portfolio.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <main className="pt-4 pb-24 container-mte">
        {loading && (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-9 h-9 text-brand animate-spin mb-4" />
            <p className="text-slate-400 text-[11px] font-semibold tracking-[0.18em] uppercase animate-pulse">
              {t.portfolio.loading}
            </p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Info className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="text-base font-bold text-slate-700 mb-2">
              {t.portfolio.emptyTitle}
            </h2>
            <p className="text-slate-400 text-sm">{t.portfolio.emptyDesc}</p>
          </div>
        )}

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
