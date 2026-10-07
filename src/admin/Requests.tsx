import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Mail, MapPin, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { BrandIcon } from "../ui/BrandIcon";
import { errorMessage, supabase } from "./supabase";
import { Button, Field, formatDateTime, inputClass, Loading, Notice, PageHeader, useFlash } from "./ui";

type Status = "nouveau" | "en_cours" | "traite" | "archive";

/** Sent when a request changes, so the menu counter follows. */
export const REQUESTS_CHANGED = "mte-requests-changed";
const changed = () => window.dispatchEvent(new Event(REQUESTS_CHANGED));

type Request = {
  id: number;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  request_type: string;
  equipment: string;
  service: string;
  message: string;
  on_site: boolean;
  status: Status;
  notes: string;
  email_sent: boolean;
};

const STATUS: Record<Status, { label: string; badge: string }> = {
  nouveau: { label: "Nouveau", badge: "bg-brand/20 text-amber-900" },
  en_cours: { label: "En cours", badge: "bg-sky-100 text-sky-800" },
  traite: { label: "Traité", badge: "bg-emerald-100 text-emerald-800" },
  archive: { label: "Archivé", badge: "bg-slate-200 text-slate-600" },
};
const FILTERS: { value: Status | "actifs" | "tous"; label: string }[] = [
  { value: "actifs", label: "À traiter" },
  { value: "nouveau", label: "Nouveaux" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traités" },
  { value: "archive", label: "Archivés" },
  { value: "tous", label: "Tous" },
];

/** WhatsApp link for an Algerian number typed as 0550…, +213 550… or 213550… */
function whatsappFor(phone: string, name: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `213${digits.slice(1)}`;
  if (digits.length < 9) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Bonjour ${name}, MTE concernant votre demande de devis.`)}`;
}

function Detail({ request, onChange, onDelete, onBack }: { request: Request; onChange: (r: Request) => void; onDelete: () => void; onBack: () => void }) {
  const flash = useFlash();
  const [notes, setNotes] = useState(request.notes);
  const [busy, setBusy] = useState(false);
  const wa = request.phone ? whatsappFor(request.phone, request.name.split(/\s+/)[0]) : null;

  const update = async (patch: Partial<Request>, done: string) => {
    setBusy(true);
    const { error } = await supabase.from("quote_requests").update(patch).eq("id", request.id);
    setBusy(false);
    if (error) return flash(errorMessage(error), "error");
    onChange({ ...request, ...patch });
    changed();
    flash(done);
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement la demande de ${request.name} ?`)) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", request.id);
    if (error) return flash(errorMessage(error), "error");
    flash("Demande supprimée");
    changed();
    onDelete();
  };

  const rows: [string, string][] = [
    ["Type de besoin", request.request_type],
    ["Automate / matériel", request.equipment],
    ["Page du site", request.service],
    ["Sur site", request.on_site ? "Intervention sur site souhaitée" : ""],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 md:hidden">
        <ArrowLeft className="size-4" /> Toutes les demandes
      </button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">{request.name}</h2>
          {request.company && <p className="text-sm text-slate-600">{request.company}</p>}
          <p className="mt-1 text-xs text-slate-500">
            Reçue le {formatDateTime(request.created_at)}
            {!request.email_sent && " · e-mail non envoyé"}
          </p>
        </div>
        <select
          aria-label="Statut"
          className={`${inputClass} w-auto`}
          value={request.status}
          disabled={busy}
          onChange={(e) => update({ status: e.target.value as Status }, "Statut mis à jour")}
        >
          {(Object.keys(STATUS) as Status[]).map((s) => (
            <option key={s} value={s}>{STATUS[s].label}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {request.phone && (
          <a href={`tel:${request.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-navy-800">
            <Phone className="size-4" /> {request.phone}
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25d366] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#1ebe5b]">
            <BrandIcon name="WhatsApp" className="size-4" /> WhatsApp
          </a>
        )}
        {request.email && (
          <a
            href={`mailto:${request.email}?subject=${encodeURIComponent("Votre demande de devis – MTE")}`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <Mail className="size-4" /> {request.email}
          </a>
        )}
      </div>

      <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-slate-500">{k}</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-800">
              {k === "Sur site" && <MapPin className="size-3.5 text-slate-400" />}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-800">{request.message}</div>

      <Field label="Notes internes" htmlFor="r-notes" className="mt-6" hint="Visibles seulement ici : prix proposé, rendez-vous, suite à donner…">
        <textarea id="r-notes" rows={3} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <div className="mt-3 flex flex-wrap justify-between gap-2">
        <Button variant="dark" disabled={notes === request.notes} loading={busy} onClick={() => update({ notes }, "Notes enregistrées")}>
          Enregistrer les notes
        </Button>
        <Button variant="danger" onClick={remove}>
          <Trash2 className="size-4" /> Supprimer
        </Button>
      </div>
    </div>
  );
}

function exportCsv(rows: Request[]) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const head = ["Date", "Nom", "Entreprise", "Téléphone", "E-mail", "Besoin", "Matériel", "Sur site", "Statut", "Message", "Notes"];
  const lines = rows.map((r) =>
    [
      formatDateTime(r.created_at),
      r.name,
      r.company,
      r.phone,
      r.email,
      r.request_type,
      r.equipment,
      r.on_site ? "Oui" : "",
      STATUS[r.status]?.label ?? r.status,
      r.message,
      r.notes,
    ]
      .map((v) => cell(v ?? ""))
      .join(";"),
  );
  const blob = new Blob([String.fromCharCode(0xfeff) + [head.map(cell).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `demandes-mte-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Requests() {
  const [items, setItems] = useState<Request[] | null>(null);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  // "?id=12" (from the dashboard) opens that request.
  const opened = Number(params.get("id")) || null;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>(opened ? "tous" : "actifs");
  const [selectedId, setSelectedId] = useState<number | null>(opened);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) setError(errorMessage(error));
    else {
      setError("");
      setItems(data as Request[]);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { tous: items?.length ?? 0, actifs: 0 };
    for (const r of items ?? []) {
      c[r.status] = (c[r.status] ?? 0) + 1;
      if (r.status === "nouveau" || r.status === "en_cours") c.actifs++;
    }
    return c;
  }, [items]);

  const q = query.trim().toLowerCase();
  const shown = (items ?? []).filter(
    (r) =>
      (filter === "tous" ? true : filter === "actifs" ? r.status === "nouveau" || r.status === "en_cours" : r.status === filter) &&
      (!q || [r.name, r.company, r.phone, r.email, r.request_type, r.equipment, r.message, r.notes].join(" ").toLowerCase().includes(q)),
  );
  const selected = items?.find((r) => r.id === selectedId) ?? null;

  return (
    <div>
      <PageHeader
        title="Demandes de devis"
        description="Les demandes envoyées depuis le formulaire du site."
        actions={
          <>
            <Button onClick={() => exportCsv(shown)} disabled={!shown.length} title="Fichier pour Excel, avec les demandes affichées">
              <Download className="size-4" /> Exporter (Excel)
            </Button>
            <Button onClick={load}>
              <RefreshCw className="size-4" /> Actualiser
            </Button>
          </>
        }
      />
      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      {!items && !error && <Loading />}
      {items && (
        <>
          <div className="relative mt-5 max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher : nom, téléphone, machine…"
              aria-label="Rechercher une demande"
              className={`${inputClass} pl-9`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value ? "bg-navy-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {f.label}
                <span className="ms-1.5 opacity-60">{counts[f.value] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <ul className={`space-y-2 ${selected ? "hidden md:block" : ""}`}>
              {shown.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Aucune demande ici.</li>}
              {shown.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full rounded-xl border bg-white p-4 text-left transition hover:border-slate-300 ${
                      r.id === selectedId ? "border-navy-900 ring-1 ring-navy-900" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-navy-900">{r.name}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[r.status].badge}`}>{STATUS[r.status].label}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDateTime(r.created_at)}
                      {r.company && ` · ${r.company}`}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {r.request_type && <span className="font-medium text-slate-700">{r.request_type} — </span>}
                      {r.message}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            <div className={selected ? "" : "hidden md:block"}>
              {selected ? (
                <Detail
                  key={selected.id}
                  request={selected}
                  onBack={() => setSelectedId(null)}
                  onChange={(r) => setItems((s) => s!.map((x) => (x.id === r.id ? r : x)))}
                  onDelete={() => {
                    setItems((s) => s!.filter((x) => x.id !== selected.id));
                    setSelectedId(null);
                  }}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                  Choisissez une demande pour voir le détail.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
