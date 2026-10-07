import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleAlert, ExternalLink, Eye, FolderKanban, Inbox, MessageCircle } from "lucide-react";
import { setTrackingOff, trackingOff } from "../track";
import { RebuildButton } from "./RebuildButton";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Card, formatDateTime, Loading, Notice, PageHeader, Toggle } from "./ui";

type Count = { key: string; count: number };
type Stats = {
  from: string;
  daily: { day: string; views: number; visits: number; contacts: number }[];
  totals: { views: number; visits: number; whatsapp: number; call: number; email: number; quote: number };
  pages: Count[];
  referrers: Count[];
  countries: Count[];
  devices: Count[];
  langs: Count[];
  contactPages: Count[];
};
type RequestRow = { id: number; created_at: string; name: string; company: string; request_type: string; status: string };
type Status = { deployHook: boolean; cronSecret: boolean; resend: boolean; secretKey: boolean; environment: string };

const PERIODS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "3 mois" },
];

const STATUS_LABEL: Record<string, { label: string; badge: string }> = {
  nouveau: { label: "Nouveau", badge: "bg-brand/20 text-amber-900" },
  en_cours: { label: "En cours", badge: "bg-sky-100 text-sky-800" },
  traite: { label: "Traité", badge: "bg-emerald-100 text-emerald-800" },
  archive: { label: "Archivé", badge: "bg-slate-200 text-slate-600" },
};

const SOURCES: [RegExp, string][] = [
  [/^google\./, "Google"],
  [/^bing\.com$/, "Bing"],
  [/^(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/^instagram\.com$/, "Instagram"],
  [/^linkedin\.com|^lnkd\.in$/, "LinkedIn"],
  [/^(youtube\.com|youtu\.be)$/, "YouTube"],
  [/^tiktok\.com$/, "TikTok"],
  [/^(t\.co|x\.com|twitter\.com)$/, "X (Twitter)"],
  [/^(chatgpt\.com|chat\.openai\.com)$/, "ChatGPT"],
  [/^perplexity\.ai$/, "Perplexity"],
  [/^duckduckgo\.com$/, "DuckDuckGo"],
  [/^yandex\./, "Yandex"],
];
const sourceName = (host: string) => (host ? (SOURCES.find(([re]) => re.test(host))?.[1] ?? host) : "Accès direct / applications");
const DEVICES: Record<string, string> = { mobile: "Téléphone", desktop: "Ordinateur", tablet: "Tablette" };
const LANGS: Record<string, string> = { fr: "Français", en: "Anglais", ar: "Arabe" };
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" });
  } catch {
    return null;
  }
})();
const countryName = (code: string) => (code ? (regionNames?.of(code) ?? code) : "Inconnu");

const shortDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

function StatCard({ icon, label, value, detail, to }: { icon: ReactNode; label: string; value: ReactNode; detail?: ReactNode; to?: string }) {
  const body = (
    <>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <span className="flex size-8 items-center justify-center rounded-lg bg-navy-900 text-brand">{icon}</span>
        {label}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-navy-900">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </>
  );
  const box = "block rounded-xl border border-slate-200 bg-white p-5";
  return to ? (
    <Link to={to} className={`${box} transition hover:border-slate-300 hover:shadow-sm`}>
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
  );
}

/** Visits per day (navy) with the contacts of the day (yellow). */
function DailyChart({ daily }: { daily: Stats["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => Math.max(d.visits, d.contacts)));
  const step = Math.ceil(daily.length / 6);
  return (
    <div>
      <div className="flex h-40 items-end gap-[2px]" aria-hidden="true">
        {daily.map((d) => (
          <div key={d.day} className="group relative flex h-full flex-1 items-end justify-center" title={`${shortDay(d.day)} : ${d.visits} visite(s), ${d.views} page(s) vue(s), ${d.contacts} contact(s)`}>
            <div className="w-full rounded-t-sm bg-navy-800 group-hover:bg-navy-700" style={{ height: `${(d.visits / max) * 100}%`, minHeight: d.visits ? 2 : 0 }} />
            {d.contacts > 0 && <div className="absolute bottom-0 w-1/2 rounded-t-sm bg-brand" style={{ height: `${(d.contacts / max) * 100}%`, minHeight: 2 }} />}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[2px] text-[10px] text-slate-400" aria-hidden="true">
        {daily.map((d, i) => (
          <span key={d.day} className="flex-1 overflow-visible text-center whitespace-nowrap">
            {i % step === 0 ? shortDay(d.day) : ""}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-navy-800" /> Visites</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand" /> Contacts (WhatsApp, appels, e-mails, formulaire)</span>
      </div>
      <table className="sr-only">
        <caption>Visites et contacts par jour</caption>
        <thead>
          <tr><th>Jour</th><th>Visites</th><th>Pages vues</th><th>Contacts</th></tr>
        </thead>
        <tbody>
          {daily.map((d) => (
            <tr key={d.day}><td>{shortDay(d.day)}</td><td>{d.visits}</td><td>{d.views}</td><td>{d.contacts}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopList({ title, rows, label, empty = "Pas encore de données." }: { title: string; rows: Count[]; label: (key: string) => ReactNode; empty?: string }) {
  const total = rows.reduce((s, r) => s + r.count, 0);
  return (
    <Card title={title}>
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

function Check({ ok, label, help }: { ok: boolean | null; label: string; help: ReactNode }) {
  return (
    <li className="flex gap-3 py-3">
      {ok === null ? (
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-slate-300" />
      ) : ok ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      ) : (
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
      )}
      <div className="min-w-0 text-sm">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{help}</p>
      </div>
    </li>
  );
}

/** Latest change made in /admin to something the pre-rendered pages show. */
async function latestChange(): Promise<string | null> {
  const tables = ["portfolio", "services", "site_settings", "site_content", "testimonials", "products"];
  const dates = await Promise.all(
    tables.map((t) =>
      supabase
        .from(t)
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .then(({ data }) => (data?.[0] as { updated_at?: string } | undefined)?.updated_at ?? null),
    ),
  );
  const times = dates.map((d) => (d ? Date.parse(d) : NaN)).filter((n) => !Number.isNaN(n));
  return times.length ? new Date(Math.max(...times)).toISOString() : null;
}

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState<"" | "setup" | string>("");
  const [requests, setRequests] = useState<RequestRow[] | null>(null);
  const [open, setOpen] = useState({ nouveau: 0, en_cours: 0 });
  const [projects, setProjects] = useState<{ id: number; slug: string | null; title: string; published: boolean; featured: boolean }[]>([]);
  const [status, setStatus] = useState<Status | null | "unavailable">(null);
  const [build, setBuild] = useState<{ builtAt: string } | null | "unavailable">(null);
  const [changedAt, setChangedAt] = useState<string | null>(null);
  const [rebuilt, setRebuilt] = useState(false);
  const [countMe, setCountMe] = useState(() => !trackingOff());

  useEffect(() => {
    let alive = true;
    supabase.rpc("site_stats", { days }).then(({ data, error }) => {
      if (!alive) return;
      if (error) return setStatsError(isMissingSetup(error) ? "setup" : errorMessage(error));
      setStatsError("");
      setStats(data as Stats);
    });
    return () => {
      alive = false;
    };
  }, [days]);

  useEffect(() => {
    supabase
      .from("quote_requests")
      .select("id, created_at, name, company, request_type, status")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setRequests((data as RequestRow[]) ?? []));
    for (const s of ["nouveau", "en_cours"] as const) {
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", s)
        .then(({ count }) => setOpen((o) => ({ ...o, [s]: count ?? 0 })));
    }
    supabase
      .from("portfolio")
      .select("id, slug, title, published, featured")
      .then(({ data }) => setProjects((data as typeof projects) ?? []));
    supabase.auth.getSession().then(({ data }) =>
      fetch("/api/status", { headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` } })
        .then((r) => (r.ok ? r.json() : "unavailable"))
        .catch(() => "unavailable")
        .then(setStatus),
    );
    fetch("/build.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : "unavailable"))
      .catch(() => "unavailable")
      .then(setBuild);
    latestChange().then(setChangedAt);
  }, []);

  const titles = useMemo(() => new Map(projects.map((p) => [p.slug || String(p.id), p.title])), [projects]);
  const pageName = (path: string) => {
    const lang = /^\/(en|ar)(?=\/|$)/.exec(path)?.[1];
    const base = (lang ? path.slice(3) : path) || "/";
    const name =
      base === "/"
        ? "Accueil"
        : base === "/portfolio"
          ? "Réalisations"
          : base === "/store"
            ? "Boutique"
            : base.startsWith("/portfolio/")
              ? (titles.get(decodeURIComponent(base.slice(11))) ?? base.slice(11))
              : base;
    return (
      <>
        {name}
        {lang && <span className="ms-1.5 rounded bg-slate-100 px-1 text-[10px] font-semibold text-slate-500 uppercase">{lang}</span>}
      </>
    );
  };

  const t = stats?.totals;
  const contacts = t ? t.whatsapp + t.call + t.email + t.quote : 0;
  const published = projects.filter((p) => p.published !== false).length;
  const builtAt = build && build !== "unavailable" ? build.builtAt : null;
  const outdated = Boolean(builtAt && changedAt && Date.parse(changedAt) > Date.parse(builtAt) && !rebuilt);

  return (
    <div className="pb-10">
      <PageHeader
        title="Tableau de bord"
        description="Vos demandes, les visites du site et l’état de sa configuration."
        actions={
          <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50">
            <ExternalLink className="size-4" /> Voir le site
          </a>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          to="/admin/demandes"
          icon={<Inbox className="size-4" />}
          label="Demandes à traiter"
          value={open.nouveau + open.en_cours}
          detail={`${open.nouveau} nouvelle(s), ${open.en_cours} en cours`}
        />
        <StatCard
          icon={<Eye className="size-4" />}
          label={`Visites (${PERIODS.find((p) => p.days === days)?.label})`}
          value={t ? t.visits : "–"}
          detail={t ? `${t.views} page(s) vue(s)` : statsError === "setup" ? "Statistiques à activer (voir plus bas)" : " "}
        />
        <StatCard
          icon={<MessageCircle className="size-4" />}
          label="Contacts depuis le site"
          value={t ? contacts : "–"}
          detail={t ? `WhatsApp ${t.whatsapp} · appels ${t.call} · e-mails ${t.email} · formulaire ${t.quote}` : " "}
        />
        <StatCard
          to="/admin/realisations"
          icon={<FolderKanban className="size-4" />}
          label="Réalisations en ligne"
          value={projects.length ? published : "–"}
          detail={projects.length ? `${projects.length - published} masquée(s) · ${projects.filter((p) => p.featured).length} ★ à l’accueil` : " "}
        />
      </div>

      <div className="mt-6">
        <Card
          title="Fréquentation"
          description="Visiteurs réels uniquement : robots et vos propres visites ne sont pas comptés. Aucun cookie, aucune donnée personnelle."
          actions={
            <div role="tablist" aria-label="Période" className="inline-flex rounded-lg bg-slate-100 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  role="tab"
                  aria-selected={days === p.days}
                  onClick={() => setDays(p.days)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${days === p.days ? "bg-white text-navy-900 shadow-xs" : "text-slate-600 hover:text-navy-900"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          }
        >
          {statsError === "setup" ? (
            <Notice>
              Pour activer les statistiques, exécutez la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor. Les visites
              sont ensuite comptées automatiquement.
            </Notice>
          ) : statsError ? (
            <Notice tone="error">{statsError}</Notice>
          ) : !stats ? (
            <Loading />
          ) : (
            <DailyChart daily={stats.daily} />
          )}
        </Card>
      </div>

      {stats && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopList title="Pages les plus vues" rows={stats.pages} label={pageName} />
          <TopList title="D’où viennent les visiteurs" rows={stats.referrers} label={sourceName} />
          <TopList title="Pays" rows={stats.countries} label={countryName} />
          <div className="grid grid-cols-1 gap-6">
            <TopList title="Appareils" rows={stats.devices} label={(k) => DEVICES[k] ?? k} />
            <TopList title="Langue des pages" rows={stats.langs} label={(k) => LANGS[k] ?? k} />
          </div>
          {stats.contactPages.length > 0 && <TopList title="Pages d’où l’on vous contacte" rows={stats.contactPages} label={pageName} />}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Dernières demandes"
          actions={
            <Link to="/admin/demandes" className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline">
              Toutes <ArrowRight className="size-4" />
            </Link>
          }
        >
          {!requests ? (
            <Loading />
          ) : requests.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune demande pour l’instant.</p>
          ) : (
            <ul className="-my-2 divide-y divide-slate-100">
              {requests.map((r) => (
                <li key={r.id}>
                  <Link to={`/admin/demandes?id=${r.id}`} className="flex items-start justify-between gap-3 py-2.5 hover:bg-slate-50">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-navy-900">{r.name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {formatDateTime(r.created_at)}
                        {r.request_type && ` · ${r.request_type}`}
                      </span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_LABEL[r.status]?.badge ?? "bg-slate-100"}`}>
                      {STATUS_LABEL[r.status]?.label ?? r.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="État du site" description="Ce qui fait fonctionner le formulaire, les statistiques et la mise à jour des pages lues par Google.">
          <ul className="-my-3 divide-y divide-slate-100">
            <Check
              ok={builtAt ? !outdated : null}
              label={builtAt ? `Pages Google générées le ${formatDateTime(builtAt)}` : "Date de génération des pages inconnue"}
              help={
                outdated ? (
                  <>
                    Des modifications plus récentes ne sont pas encore dans ces pages.{" "}
                    <RebuildButton label="Mettre à jour maintenant" onDone={() => setRebuilt(true)} className="inline-flex items-center gap-1 font-semibold text-navy-900 underline disabled:opacity-60" />
                  </>
                ) : (
                  "Les visiteurs voient toujours vos dernières modifications ; ces pages servent à Google et aux assistants IA."
                )
              }
            />
            {status === "unavailable" ? (
              <Check ok={null} label="Réglages Vercel" help="Vérification disponible seulement sur le site en ligne." />
            ) : (
              <>
                <Check
                  ok={status ? status.deployHook : null}
                  label="Mise à jour des pages (DEPLOY_HOOK_URL)"
                  help={status?.deployHook ? "Le bouton « Mettre à jour le site public » fonctionne." : "Vercel → projet du site → Settings → Git → Deploy Hooks, puis ajoutez le lien dans Environment Variables et redéployez."}
                />
                <Check
                  ok={status ? status.cronSecret : null}
                  label="Mise à jour automatique chaque nuit (CRON_SECRET)"
                  help={status?.cronSecret ? "Les pages sont régénérées chaque nuit vers 4 h." : "Ajoutez une longue chaîne aléatoire CRON_SECRET dans Vercel → Environment Variables, puis redéployez."}
                />
                <Check
                  ok={status ? status.resend : null}
                  label="E-mails des demandes (RESEND_API_KEY)"
                  help={status?.resend ? "Chaque demande vous est envoyée par e-mail." : "Sans cette clé, les demandes restent visibles ici mais aucun e-mail n’est envoyé."}
                />
                <Check
                  ok={status ? status.secretKey : null}
                  label="Enregistrement des demandes et des visites (SUPABASE_SECRET_KEY)"
                  help={status?.secretKey ? "Demandes et statistiques sont enregistrées." : "Sans cette clé, ni les demandes ni les visites ne sont enregistrées."}
                />
              </>
            )}
            <li className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <span className="text-slate-700">Compter mes propres visites sur cet appareil</span>
              <Toggle
                checked={countMe}
                onChange={(v) => {
                  setTrackingOff(!v);
                  setCountMe(v);
                }}
                label={countMe ? "Oui" : "Non"}
              />
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
