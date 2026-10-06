import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageOff, Play } from "lucide-react";
import { coverImage, fetchPortfolio, formatDate, getYouTubeId, sortedMedia, splitDescription, type PortfolioItem } from "../portfolio";
import { isVideoMedia } from "../utils/imageOptimizer";
import { Seo } from "../ui/Seo";

function Card({ item }: { item: PortfolioItem }) {
  const media = sortedMedia(item);
  const cover = coverImage(item);
  const hasVideo = media.some((m) => getYouTubeId(m.media_url) || isVideoMedia(m.media_url, m.media_type));
  const { body, tags } = splitDescription(item.description);

  return (
    <li>
      <Link
        to={`/portfolio/${item.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-200">
          {cover ? (
            <img
              src={cover}
              alt={item.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-slate-400">
              <ImageOff className="size-8" />
            </div>
          )}
          {hasVideo && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded bg-navy-950/75 px-2 py-1 text-[11px] font-semibold text-white">
              <Play className="size-3" fill="currentColor" /> Vidéo
            </span>
          )}
          {media.length > 1 && (
            <span className="absolute top-3 right-3 rounded bg-navy-950/75 px-2 py-1 text-[11px] font-semibold text-white">
              {media.length} médias
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
          <h2 className="mt-1.5 text-lg leading-snug font-semibold text-navy-900 group-hover:text-navy-700">{item.title}</h2>
          {body && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{body}</p>}
          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <li key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-900">
            Voir le projet
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  useEffect(() => {
    fetchPortfolio().then(setItems);
  }, []);

  return (
    <>
      <Seo
        title="Réalisations – réparations industrielles | MTE Algérie"
        description="Interventions réelles de MTE : réparation de variateurs de vitesse, automates, cartes électroniques et équipements industriels partout en Algérie."
        path="/portfolio"
      />

      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">Réalisations</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Nos interventions sur le terrain</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            Variateurs, automates, cartes de puissance, machines de production : quelques réparations et mises en service
            réalisées pour nos clients en Algérie.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-page">
          {items === null ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Chargement">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="h-96 animate-pulse rounded-xl bg-slate-200/70" />
              ))}
            </ul>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-slate-500">Les réalisations seront bientôt publiées.</p>
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
