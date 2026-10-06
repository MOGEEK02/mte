import { useEffect, useRef, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { getYouTubeId, sortedMedia, stillImage, videoSource, type PortfolioItem } from "../portfolio";
import { isImageMedia } from "../utils/imageOptimizer";

const MEDIA = "relative size-full object-contain transition duration-500 group-hover:scale-[1.03]";

/** Plays muted and on a loop while on screen; stays on its still frame with reduced motion or data saving. */
function CardVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden className={`pointer-events-none ${MEDIA}`} />;
}

/**
 * The project's first photo or video, shown whole in a vertical frame (most videos are filmed on a phone),
 * with a blurred copy behind instead of empty bars. `children` are drawn on top (badges).
 */
export function CardMedia({ item, alt, children }: { item: PortfolioItem; alt: string; children?: ReactNode }) {
  const first = sortedMedia(item)[0];
  const still = first ? stillImage(first) : null;
  const video = first && !getYouTubeId(first.media_url) && !isImageMedia(first.media_url, first.media_type);
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-navy-950">
      {still && <img src={still} alt="" aria-hidden loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl" />}
      {video ? (
        <CardVideo src={videoSource(first.media_url)} poster={still ?? undefined} />
      ) : still ? (
        <img src={still} alt={alt} loading="lazy" referrerPolicy="no-referrer" className={MEDIA} />
      ) : (
        <div className="flex size-full items-center justify-center bg-slate-200 text-slate-400">
          <ImageOff className="size-8" />
        </div>
      )}
      {children}
    </div>
  );
}
