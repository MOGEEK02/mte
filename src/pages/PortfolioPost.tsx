import { useCallback, useEffect, useMemo, useRef, useState, type RefObject, type TouchEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ImageOff, Languages } from "lucide-react";
import {
  fetchPortfolioItem,
  findProject,
  formatDate,
  getYouTubeId,
  portfolioStore,
  projectPath,
  projectText,
  sortedMedia,
  splitDescription,
  stillImage,
  videoSource,
  type MediaItem,
  type PortfolioItem,
} from "../portfolio";
import { projectMeta } from "../seo";
import { localePath, useLang, useT } from "../i18n";
import { FALLBACK_IMAGE, getOptimizedImageUrl, isImageMedia } from "../utils/imageOptimizer";
import { Seo } from "../ui/Seo";
import NotFound from "./NotFound";

const WIDE = 16 / 9;
const TALL = 9 / 16;

/** Plays muted (browsers only start muted videos on their own); the visitor can turn the sound on. */
function Video({ media, playing, loop, onEnded, onRatio }: { media: MediaItem; playing: boolean; loop: boolean; onEnded: () => void; onRatio: (r: number) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <video
      ref={ref}
      src={videoSource(media.media_url)}
      poster={stillImage(media) ?? undefined}
      controls
      muted
      playsInline
      loop={loop}
      preload="metadata"
      onEnded={onEnded}
      onLoadedMetadata={(e) => e.currentTarget.videoWidth && onRatio(e.currentTarget.videoWidth / e.currentTarget.videoHeight)}
      className="relative size-full object-contain"
    />
  );
}

/** Width ÷ height of each media, read from its still image, so the frame can take the media's shape. */
function useRatios(media: MediaItem[]) {
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const learn = useCallback((id: number, r: number) => setRatios((all) => (all[id] === r ? all : { ...all, [id]: r })), []);
  useEffect(() => {
    let alive = true;
    for (const m of media) {
      const src = getYouTubeId(m.media_url) ? null : stillImage(m);
      if (!src) continue;
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.onload = () => alive && img.naturalWidth > 0 && learn(m.id, img.naturalWidth / img.naturalHeight);
      img.src = src;
    }
    return () => {
      alive = false;
    };
  }, [media, learn]);
  return { ratios, learn };
}

/** Whether the slideshow may move: gallery on screen, tab visible, and no reduced-motion preference. */
function useCanAnimate(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
    };
  }, [ref]);
  return { live: inView && pageVisible, reduced };
}

function Gallery({ item, title }: { item: PortfolioItem; title: string }) {
  const t = useT().post;
  const media = useMemo(() => sortedMedia(item), [item]);
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const [hover, setHover] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const { ratios, learn } = useRatios(media);
  const { live, reduced } = useCanAnimate(boxRef);
  const go = useCallback((d: number) => setIndex((i) => (i + d + media.length) % media.length), [media.length]);

  // Keeps the current thumbnail in view in the strip, without scrolling the page.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[index];
    if (!strip || !thumb) return;
    const s = strip.getBoundingClientRect();
    const r = thumb.getBoundingClientRect();
    strip.scrollBy({ left: r.left + r.width / 2 - (s.left + s.width / 2), behavior: "smooth" });
  }, [index]);

  if (media.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <ImageOff className="size-10" />
      </div>
    );
  }

  // The frame takes the shape of the tallest media (phone videos are vertical), within the screen height.
  const known = media.map((m) => (getYouTubeId(m.media_url) ? WIDE : ratios[m.id])).filter((r): r is number => Boolean(r));
  const ratio = Math.max(TALL, Math.min(WIDE, ...known));
  const current = media[index];
  const currentIsImage = !getYouTubeId(current.media_url) && isImageMedia(current.media_url, current.media_type);
  const several = media.length > 1;

  return (
    <div>
      <div
        ref={boxRef}
        className="relative max-h-[75svh] w-full overflow-hidden rounded-xl bg-navy-950"
        style={{ aspectRatio: ratio }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
        onBlur={() => setKeyboardFocus(false)}
        onTouchStart={(e: TouchEvent) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e: TouchEvent) => {
          if (touchX === null || !several) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
      >
        {media.map((m, i) => {
          const active = i === index;
          const yt = getYouTubeId(m.media_url);
          const backdrop = active && !yt ? stillImage(m) : null;
          return (
            <div key={m.id} className={`absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              {/* Blurred copy behind media of another shape, instead of plain black bars. */}
              {backdrop && <img src={backdrop} alt="" aria-hidden referrerPolicy="no-referrer" className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl" />}
              {yt ? (
                // Only the visible slide holds a player, so hidden videos never play.
                active && (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&playsinline=1${live && !reduced ? "&autoplay=1&mute=1" : ""}`}
                    title={`${title} – ${i + 1}`}
                    className="relative size-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : !isImageMedia(m.media_url, m.media_type) ? (
                active && <Video media={m} playing={live && !reduced} loop={!several} onEnded={() => go(1)} onRatio={(r) => learn(m.id, r)} />
              ) : (
                <img
                  src={stillImage(m, "h") ?? getOptimizedImageUrl(m.media_url)}
                  alt={`${title} – ${i + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="relative size-full object-contain"
                />
              )}
            </div>
          );
        })}
        {several && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="absolute top-1/2 start-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-950 shadow hover:bg-white">
              <ChevronLeft className="size-5 rtl:-scale-x-100" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.next} className="absolute top-1/2 end-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-950 shadow hover:bg-white">
              <ChevronRight className="size-5 rtl:-scale-x-100" />
            </button>
            <span className="absolute top-3 end-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-xs font-semibold text-white">
              {index + 1} / {media.length}
            </span>
            {/* Photos: the next slide comes when the bar is full (paused under the mouse or off screen). Videos move on when they end. */}
            {currentIsImage && !reduced && (
              <span
                key={index}
                aria-hidden
                onAnimationEnd={() => go(1)}
                className="absolute inset-x-0 bottom-0 h-1 origin-left animate-slide-progress bg-brand rtl:origin-right"
                style={{ animationPlayState: live && !hover && !keyboardFocus ? "running" : "paused" }}
              />
            )}
          </>
        )}
      </div>

      {several && (
        <ul ref={thumbsRef} className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => {
            const thumb = stillImage(m);
            return (
              <li key={m.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t.show(i + 1)}
                  aria-current={i === index}
                  className={`block h-14 w-20 overflow-hidden rounded-md border-2 bg-navy-950 ${i === index ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  {thumb && <img src={thumb} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** A project not in the loaded list (new, or opened from an old link) is fetched on its own. */
function useProject(id: string) {
  const all = portfolioStore.use();
  const listed = (all && findProject(all, id)) ?? null;
  const [single, setSingle] = useState<{ id: string; item: PortfolioItem | null } | null>(null);
  const needFetch = all !== null && !listed;
  useEffect(() => {
    if (!needFetch) return;
    let alive = true;
    fetchPortfolioItem(id).then((item) => alive && setSingle({ id, item }));
    return () => {
      alive = false;
    };
  }, [id, needFetch]);
  if (listed) return { item: listed, loading: false };
  if (all === null || (needFetch && single?.id !== id)) return { item: null, loading: true };
  return { item: single?.item ?? null, loading: false };
}

export default function PortfolioPost() {
  const lang = useLang();
  const { post: t, nav } = useT();
  const { id = "" } = useParams();
  const { item, loading } = useProject(id);

  if (loading) {
    return (
      <div className="container-page max-w-4xl pt-32 pb-20">
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 aspect-video animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }
  if (!item) return <NotFound />;
  // Old links by number (/portfolio/18) lead to the project's readable address.
  if (item.slug && id !== item.slug) return <Navigate to={localePath(lang, projectPath(item))} replace />;

  const text = projectText(item, lang);
  const { body, tags } = splitDescription(text.description);

  return (
    <>
      <Seo {...projectMeta(item, lang)} />

      <article className="container-page max-w-4xl pt-28 pb-20 sm:pt-32" lang={text.translated ? undefined : "fr"} dir={text.translated ? undefined : "ltr"}>
        <Link to={localePath(lang, "/portfolio")} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-900">
          <ArrowLeft className="size-4 rtl:-scale-x-100" />
          {t.back}
        </Link>
        <header className="mt-5">
          <p className="text-sm text-slate-500">
            <time dateTime={item.created_at}>{formatDate(item.created_at, lang)}</time>
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight text-navy-900 sm:text-4xl">{text.title}</h1>
          {!text.translated && t.originalLanguage && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-600" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
              <Languages className="size-3.5" />
              {t.originalLanguage}
            </p>
          )}
        </header>

        <div className="mt-8">
          <Gallery item={item} title={text.title} />
        </div>

        {body && <div className="mt-8 text-base leading-relaxed whitespace-pre-line text-slate-700">{body}</div>}
        {tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <aside className="mt-12 flex flex-col gap-5 rounded-xl bg-navy-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-white">{t.ctaTitle}</h2>
            <p className="mt-1 text-sm text-slate-300">{t.ctaText}</p>
          </div>
          <Link to={localePath(lang, "/#contact")} className="btn-primary shrink-0">
            {nav.quote}
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </aside>
      </article>
    </>
  );
}
