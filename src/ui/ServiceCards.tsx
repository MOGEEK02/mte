import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useServices } from "../services";
import { ServiceArt } from "./ServiceArt";

/** The four services, each linking to its page. */
export function ServiceCards() {
  const { services } = useServices();
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {services.map((s) => (
        <li key={s.slug}>
          <Link
            to={`/services/${s.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ServiceArt kind={s.art} className="aspect-[5/3] transition duration-500 group-hover:bg-navy-800" />
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
