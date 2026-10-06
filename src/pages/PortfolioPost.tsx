import { useEffect, useState, type TouchEvent } from "react";
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

function Media({ media, title, active }: { media: MediaItem; title: string; active: boolean }) {
  const yt = getYouTubeId(media.media_url);
  if (yt) {
    // Only the visible slide holds a player, so hidden videos never play.
    return active ? (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`}
        title={title}
        className="size-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : null;
  }
  if (!isImageMedia(media.media_url, media.media_type)) {
    return active ? (
      <video src={videoSource(media.media_url)} poster={stillImage(media) ?? undefined} controls playsInline preload="metadata" className="size-full object-contain" />
    ) : null;
  }
  return (
    <img
      src={stillImage(media, "h") ?? getOptimizedImageUrl(media.media_url)}
      alt={title}
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_IMAGE;
      }}
      className="size-full object-contain"
    />
  );
}

function Gallery({ item, title }: { item: PortfolioItem; title: string }) {
  const t = useT().post;
  const media = sortedMedia(item);
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const go = (d: number) => setIndex((i) => (i + d + media.length) % media.length);

  if (media.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <ImageOff className="size-10" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-navy-950"
        onTouchStart={(e: TouchEvent) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e: TouchEvent) => {
          if (touchX === null || media.length < 2) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
      >
        {media.map((m, i) => (
          <div key={m.id} className={`absolute inset-0 transition-opacity duration-300 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <Media media={m} title={`${title} – ${i + 1}`} active={i === index} />
          </div>
        ))}
        {media.length > 1 && (
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
          </>
        )}
      </div>

      {media.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
