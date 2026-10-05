import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../utils/supabase";
import { useLang } from "../i18n/LanguageProvider";
import { getOptimizedImageUrl, isImageMedia, FALLBACK_IMAGE } from "../utils/imageOptimizer";

interface Media { media_url: string; media_type: "image" | "video"; sort_order: number }
interface Item { id: number; title: string; created_at: string; portfolio_media: Media[] }

function firstImage(media: Media[]): string | null {
  const sorted = [...(media || [])].sort((a, b) => a.sort_order - b.sort_order);
  const img = sorted.find((m) => isImageMedia(m.media_url, m.media_type)) || sorted[0];
  return img ? img.media_url : null;
}

export default function RecentProjects() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select(`id, title, created_at, portfolio_media ( media_url, media_type, sort_order )`)
        .order("created_at", { ascending: false })
        .limit(3);
      if (active && !error && data) setItems(data as Item[]);
    })();
    return () => { active = false; };
  }, []);

  // Progressive: render nothing until real projects load (prerender stays clean).
  if (items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container-mte">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title mt-3">{t.projects.title}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t.projects.intro}</p>
          </div>
          <Link to="/portfolio" className="btn-outline hidden sm:inline-flex">
            {t.projects.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const img = firstImage(item.portfolio_media);
            const date = new Date(item.created_at).toLocaleDateString(
              lang === "fr" ? "fr-FR" : "en-GB",
              { month: "long", year: "numeric" }
            );
            return (
              <Link
                key={item.id}
                to={`/portfolio/${item.id}`}
                className="group relative overflow-hidden rounded-md bg-ink aspect-[4/3]"
              >
                <img
                  src={img ? getOptimizedImageUrl(img, 900) : FALLBACK_IMAGE}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-safety">{date}</div>
                  <h3 className="mt-1 text-base font-extrabold uppercase tracking-tight text-white leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:hidden">
          <Link to="/portfolio" className="btn-outline w-full">
            {t.projects.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
