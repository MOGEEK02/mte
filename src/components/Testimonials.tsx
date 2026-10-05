import { Quote } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  const { t } = useLang();
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-zinc-50">
      <div className="container-mte">
        <div className="max-w-2xl">
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2 className="section-title mt-3">{t.testimonials.title}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <figure key={i} className="rounded-md border border-slate-200 bg-white p-6">
              <Quote size={28} className="text-brand" />
              <blockquote className="mt-4 text-slate-700 leading-relaxed">“{item.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-bold text-ink">{item.author}</span>
                {item.role && <span className="text-slate-500"> — {item.role}</span>}
                {item.date && <span className="text-slate-400"> · {item.date}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
