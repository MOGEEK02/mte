import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import { telHref, useContact, whatsappLink } from "../contact";
import { localePath, useLang, type Lang } from "../i18n";
import { contentStore } from "../content";
import { BLOG_HUB, BLOG_PATH, isPostHidden, orderedPosts, postBody, postDescription, postPath, postTitle, type Post } from "../blog";
import { renderMarkdown } from "../ui/markdown";
import { BrandIcon } from "../ui/BrandIcon";
import { Seo } from "../ui/Seo";
import { blogMeta } from "../seo";

type L<T = string> = Record<Lang, T>;
const UI = {
  home: { fr: "Accueil", en: "Home", ar: "الرئيسية" },
  ctaTitle: { fr: "Un besoin similaire ?", en: "A similar need?", ar: "حاجة مماثلة؟" },
  ctaText: {
    fr: "MTE : programmation d'automates et d'IHM, dépannage d'armoires et réparation électronique industrielle, partout en Algérie.",
    en: "MTE: PLC and HMI programming, control-panel troubleshooting and industrial electronics repair, across Algeria.",
    ar: "MTE: برمجة المتحكمات وشاشات IHM، تصليح الخزائن والإصلاح الإلكتروني الصناعي، في كامل الجزائر.",
  },
  more: { fr: "À lire aussi", en: "Read next", ar: "اقرأ أيضاً" },
} satisfies Record<string, L>;

const PROSE =
  "[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-navy-900 " +
  "[&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-slate-700 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5 " +
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1.5 [&_li]:text-slate-700 [&_li]:leading-relaxed " +
  "[&_a]:font-medium [&_a]:text-navy-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-navy-900 [&_strong]:text-navy-900 [&_strong]:font-semibold";

export default function BlogPost({ post }: { post: Post }) {
  const lang = useLang();
  const contact = useContact();
  const to = (p: string) => localePath(lang, p);
  const cfg = contentStore.use().blog;
  const others = orderedPosts(cfg).filter((p) => p.slug !== post.slug).slice(0, 3);
  const html = renderMarkdown(postBody(post, lang, cfg));
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-DZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Seo {...blogMeta(lang, post, isPostHidden(post.slug, cfg))} />

      <section className="bg-navy-950 pt-32 pb-12 sm:pt-36 sm:pb-14">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to={to("/")} className="hover:text-white">{UI.home[lang]}</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5 rtl:-scale-x-100" /></li>
              <li><Link to={to(BLOG_PATH)} className="hover:text-white">{BLOG_HUB.eyebrow[lang]}</Link></li>
            </ol>
          </nav>
          <p className="mt-6 text-sm text-slate-400">{BLOG_HUB.published[lang]} {fmt(post.date)}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">{postTitle(post, lang, cfg)}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{postDescription(post, lang, cfg)}</p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className={`max-w-2xl ${PROSE}`} dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="lg:sticky lg:top-24 rounded-2xl bg-navy-950 p-6 text-white">
            <h2 className="text-lg font-bold">{UI.ctaTitle[lang]}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{UI.ctaText[lang]}</p>
            <div className="mt-5 grid gap-2.5">
              <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                <BrandIcon name="WhatsApp" className="size-4" />
                WhatsApp
              </a>
              <a href={telHref(contact.phone)} className="btn-outline-light w-full">
                <Phone className="size-4" />
                <span dir="ltr">{contact.phone}</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="container-page">
            <h2 className="text-xl font-bold text-navy-900">{UI.more[lang]}</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={to(postPath(o))} className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
                    <p className="text-xs text-slate-500">{fmt(o.date)}</p>
                    <h3 className="mt-1.5 line-clamp-2 font-semibold text-navy-900 group-hover:text-navy-700">{postTitle(o, lang, cfg)}</h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-900">
                      {BLOG_HUB.readMore[lang]}
                      <ArrowRight className="size-3.5 rtl:-scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
