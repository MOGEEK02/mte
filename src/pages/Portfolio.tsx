import { Link } from "react-router-dom";
import { ArrowRight, ImageOff, Play } from "lucide-react";
import { coverImage, formatDate, getYouTubeId, portfolioStore, projectPath, projectText, sortedMedia, splitDescription, type PortfolioItem } from "../portfolio";
import { localePath, useLang, useT } from "../i18n";
import { isVideoMedia } from "../utils/imageOptimizer";
import { Seo } from "../ui/Seo";

function Card({ item }: { item: PortfolioItem }) {
  const lang = useLang();
  const t = useT().work;
  const media = sortedMedia(item);
  const cover = coverImage(item);
  const hasVideo = media.some((m) => getYouTubeId(m.media_url) || isVideoMedia(m.media_url, m.media_type));
  const text = projectText(item, lang);
  const { body, tags } = splitDescription(text.description);

  return (
    <li>
      <Link
        to={localePath(lang, projectPath(item))}
        lang={text.translated ? undefined : "fr"}
        dir={text.translated ? undefined : "ltr"}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-200">
          {cover ? (
            <img src={cover} alt={text.title} loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex size-full items-center justify-center text-slate-400">
              <ImageOff className="size-8" />
            </div>
          )}
          {hasVideo && (
            <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded bg-navy-950/75 px-2 py-1 text-[11px] font-semibold text-white">
              <Play className="size-3" fill="currentColor" /> {t.video}
            </span>
          )}
          {media.length > 1 && (
            <span className="absolute top-3 end-3 rounded bg-navy-950/75 px-2 py-1 text-[11px] font-semibold text-white">{t.media(media.length)}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs text-slate-500">{formatDate(item.created_at, lang)}</p>
          <h2 className="mt-1.5 text-lg leading-snug font-semibold text-navy-900 group-hover:text-navy-700">{text.title}</h2>
          {body && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{body}</p>}
          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <li key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-900">
            {t.open}
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function Portfolio() {
  const lang = useLang();
  const { work: t, seo } = useT();
  const items = portfolioStore.use();

  return (
    <>
      <Seo lang={lang} path="/portfolio" title={seo.workTitle} description={seo.workDescription} />

      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">{t.text}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-page">
          {items === null ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label={t.loading}>
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="h-96 animate-pulse rounded-xl bg-slate-200/70" />
              ))}
            </ul>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-slate-500">{t.empty}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
