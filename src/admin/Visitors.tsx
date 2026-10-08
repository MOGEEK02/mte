import type { ReactNode } from "react";
import { Card, formatDateTime, Notice } from "./ui";
import { cityName, countryName, DEVICES, regionName, sourceName } from "./visitor-labels";

/** Who the visitors are: figures added by supabase/visiteurs.sql to site_stats(). */

export type Count = { key: string; count: number };
export type VisitorStats = {
  visitors?: { visits: number; returning: number; views: number; deeper: number; live: number };
  regions?: Count[];
  cities?: Count[];
  browsers?: Count[];
  systems?: Count[];
  landing?: Count[];
  hours?: number[];
  weekdays?: number[];
  sources?: { key: string; visits: number; contacts: number }[];
  recent?: {
    at: string;
    path: string;
    referrer: string;
    device: string;
    browser: string;
    os: string;
    country: string;
    region: string;
    city: string;
    returning: boolean | null;
  }[];
};

const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)} %` : "–");

export function TopList({ title, rows, label, empty = "Pas encore de données.", description }: { title: string; rows: Count[]; label: (key: string) => ReactNode; empty?: string; description?: string }) {
  const total = rows.reduce((s, r) => s + r.count, 0);
  return (
    <Card title={title} description={description}>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.key} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-slate-700">{label(r.key)}</span>
                <span className="shrink-0 font-semibold text-navy-900 tabular-nums">{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-navy-700" style={{ width: `${Math.max(3, (r.count / total) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Figure({ label, value, detail }: { label: string; value: ReactNode; detail: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-navy-900 tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

/** Small bar chart: one bar per hour or per day. */
function Bars({ values, labels, every = 1, caption }: { values: number[]; labels: string[]; every?: number; caption: string }) {
  const max = Math.max(1, ...values);
  const best = values.indexOf(Math.max(...values));
  return (
    <div>
      <div className="flex h-28 items-end gap-[3px]" aria-hidden="true">
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 items-end" title={`${labels[i]} : ${v} visite(s)`}>
            <div className={`w-full rounded-t-sm ${i === best && v > 0 ? "bg-brand" : "bg-navy-800"}`} style={{ height: `${(v / max) * 100}%`, minHeight: v ? 2 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-[3px] text-[10px] text-slate-400" aria-hidden="true">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center whitespace-nowrap">
            {i % every === 0 ? l : ""}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {values.map((v, i) => (
            <tr key={i}><th>{labels[i]}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Algerian week: Saturday first. site_stats() counts from Monday (0) to Sunday (6).
const WEEK = [5, 6, 0, 1, 2, 3, 4];
const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function VisitorDetails({ stats, pageName }: { stats: VisitorStats; pageName: (path: string) => ReactNode }) {
  const v = stats.visitors;
  if (!v) {
    return (
      <div className="mt-6">
        <Notice>
          Pour voir qui sont vos visiteurs (wilaya, ville, heure, navigateur, nouveaux ou revenus…), exécutez{" "}
          <code>supabase/visiteurs.sql</code> dans Supabase → SQL Editor du site.
        </Notice>
      </div>
    );
  }
  const hours = stats.hours ?? [];
  const weekdays = stats.weekdays ?? [];
  const busiestHour = hours.some((h) => h > 0) ? hours.indexOf(Math.max(...hours)) : -1;
  const busiestDay = weekdays.some((d) => d > 0) ? weekdays.indexOf(Math.max(...weekdays)) : -1;
  const sources = stats.sources ?? [];
  const recent = stats.recent ?? [];

  return (
    <div className="mt-6 space-y-6">
      <Card
        title="Qui sont vos visiteurs"
        description="Calculé sur les visites enregistrées depuis l’activation de ces détails. Lieu approximatif, d’après le réseau du visiteur."
      >
        {v.visits === 0 ? (
          <p className="text-sm text-slate-500">Les détails apparaîtront avec les prochaines visites.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Figure label="Nouveaux visiteurs" value={pct(v.visits - v.returning, v.visits)} detail={`${v.visits - v.returning} première(s) visite(s)`} />
            <Figure label="Visiteurs revenus" value={v.returning} detail="déjà venus sur le site" />
            <Figure label="Pages par visite" value={(v.views / v.visits).toFixed(1).replace(".", ",")} detail={`${v.views} page(s) vue(s)`} />
            <Figure label="Partis après 1 page" value={pct(v.visits - v.deeper, v.visits)} detail={`${v.deeper} visite(s) ont continué`} />
            <Figure label="En ce moment" value={v.live} detail="page(s) vue(s), 15 dernières min" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopList title="Wilayas" description="Approximatif : l’opérateur peut situer le visiteur dans une wilaya voisine." rows={stats.regions ?? []} label={regionName} />
        <TopList title="Villes" rows={stats.cities ?? []} label={cityName} />
        <TopList title="Pages d’arrivée" description="La première page vue : souvent celle trouvée sur Google." rows={stats.landing ?? []} label={pageName} />
        <Card title="Sources et contacts" description="Combien de visites chaque source apporte, et combien finissent en contact.">
          {sources.length === 0 ? (
            <p className="text-sm text-slate-500">Pas encore de données.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 text-right font-medium">Visites</th>
                  <th className="pb-2 text-right font-medium">Contacts</th>
                  <th className="pb-2 text-right font-medium">Taux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sources.map((s) => (
                  <tr key={s.key}>
                    <td className="max-w-0 truncate py-2 pe-2 text-slate-700">{s.key ? sourceName(s.key) : "Accès direct"}</td>
                    <td className="py-2 text-right tabular-nums">{s.visits}</td>
                    <td className="py-2 text-right font-semibold text-navy-900 tabular-nums">{s.contacts}</td>
                    <td className="py-2 text-right text-slate-500 tabular-nums">{s.visits ? pct(s.contacts, s.visits) : "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card
        title="Quand viennent-ils"
        description={
          busiestHour < 0
            ? "Heure d’Algérie."
            : `Heure d’Algérie. Le plus de visites vers ${busiestHour} h, et le ${["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"][busiestDay]} : le bon moment pour être joignable.`
        }
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Par heure</p>
            <Bars values={hours} labels={hours.map((_, h) => `${h} h`)} every={3} caption="Visites par heure" />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Par jour de la semaine</p>
            <Bars values={WEEK.map((d) => weekdays[d] ?? 0)} labels={WEEK.map((d) => DAY_NAMES[d])} caption="Visites par jour de la semaine" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopList title="Navigateurs" rows={stats.browsers ?? []} label={(k) => k} />
        <TopList title="Systèmes" rows={stats.systems ?? []} label={(k) => k} />
      </div>

      <Card title="Dernières visites" description="La première page de chaque visite. Aucun nom ni adresse IP : seulement le lieu approximatif et l’appareil.">
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">Pas encore de visite enregistrée avec ces détails.</p>
        ) : (
          <ul className="-my-2 divide-y divide-slate-100">
            {recent.map((r, i) => {
              const place = [r.city && cityName(r.city), r.region.startsWith("DZ-") ? regionName(r.region).replace(/ \(\d+\)$/, "") : "", r.country !== "DZ" ? countryName(r.country) : ""]
                .filter((x, j, all) => x && all.indexOf(x) === j)
                .join(", ");
              return (
                <li key={`${r.at}-${i}`} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium text-navy-900">
                      {place || "Lieu inconnu"}
                      {r.returning !== null && (
                        <span className={`ms-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.returning ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"}`}>
                          {r.returning ? "Revenu" : "Nouveau"}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {sourceName(r.referrer)} → {pageName(r.path)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-slate-500">
                    <span className="block">{formatDateTime(r.at)}</span>
                    <span className="block">{[DEVICES[r.device] ?? r.device, r.browser, r.os].filter(Boolean).join(" · ")}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
