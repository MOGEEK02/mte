import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { localePath, useLang } from "../i18n";
import { contentStore } from "../content";
import { allPosts, postPath, BLOG_HUB } from "../blog";
import { Seo } from "../ui/Seo";
import { blogsMeta } from "../seo";

export default function Blog() {
  const lang = useLang();
  const to = (p: string) => localePath(lang, p);
  const cfg = contentStore.use().blog;
  const posts = allPosts(cfg);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-DZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Seo {...blogsMeta(lang)} />

      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">{BLOG_HUB.eyebrow[lang]}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{BLOG_HUB.h1[lang]}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{BLOG_HUB.intro[lang]}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="py-16 text-center text-slate-500">—</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={to(postPath(post))}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:border-navy-300 hover:shadow-md"
                  >
                    {post.cover && (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        <img src={post.cover} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-[1.03]" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-slate-500">{fmt(post.date)}</p>
                      <h2 className="mt-2 text-lg leading-snug font-semibold text-navy-900 group-hover:text-navy-700">{post.title[lang]}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.description[lang]}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-900">
                        {BLOG_HUB.readMore[lang]}
                        <ArrowRight className="size-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
