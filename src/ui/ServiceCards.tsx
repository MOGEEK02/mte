import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SERVICE_PAGES } from "../services";

/** The four services, each linking to its page. */
export function ServiceCards() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {SERVICE_PAGES.map((s) => (
        <li key={s.slug}>
          <Link
            to={`/services/${s.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-200">
              <img
                src={s.image}
                alt={s.imageAlt}
                loading="lazy"
                width={1200}
                height={800}
                className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-2.5 flex-1 leading-relaxed text-slate-600">{s.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                En savoir plus
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
