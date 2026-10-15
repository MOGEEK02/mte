/* eslint-disable react-refresh/only-export-components -- calculators + their slug→component map live together; not hot-reloaded individually */
import { useState, type ReactNode } from "react";
import { useLang, type Lang } from "../i18n";

/**
 * Interactive calculators for the /outils pages. Each one renders with sensible defaults
 * (so the pre-rendered HTML is meaningful) and recomputes live in the browser.
 */

type L<T = string> = Record<Lang, T>;

const num = (s: string) => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : NaN;
};
const ok = (v: number) => Number.isFinite(v);
function fmt(v: number, d = 2): string {
  if (!Number.isFinite(v)) return "—";
  const r = Math.abs(v) >= 100 ? Math.round(v * 10) / 10 : Math.round(v * 10 ** d) / 10 ** d;
  return String(r);
}

/* ── shared UI ── */

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <span className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-slate-300 focus-within:border-navy-700 focus-within:ring-2 focus-within:ring-navy-700/15">
        <input
          type="number"
          inputMode="decimal"
          dir="ltr"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-white px-3 py-2.5 text-navy-900 outline-none"
        />
        {unit && <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-slate-500">{unit}</span>}
      </span>
    </label>
  );
}

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Results({ rows }: { rows: { label: string; value: string; unit?: string; strong?: boolean }[] }) {
  return (
    <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-navy-900/10 bg-navy-900/10">
      {rows.map((r, i) => (
        <div key={i} className={`flex items-center justify-between gap-4 px-4 py-3 ${r.strong ? "bg-navy-950 text-white" : "bg-white"}`}>
          <dt className={`text-sm ${r.strong ? "text-slate-300" : "text-slate-600"}`}>{r.label}</dt>
          <dd className={`font-mono text-base font-bold ${r.strong ? "text-brand" : "text-navy-900"}`} dir="ltr">
            {r.value} {r.unit && <span className="text-sm font-medium opacity-70">{r.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

const t = (lang: Lang, l: L) => l[lang];

/* ── material & section helpers ── */
const RHO = { cu: 0.0225, al: 0.036 }; // Ω·mm²/m (operating temperature)
const SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
const matOptions = (lang: Lang) => [
  { value: "cu" as const, label: t(lang, { fr: "Cuivre", en: "Copper", ar: "نحاس" }) },
  { value: "al" as const, label: t(lang, { fr: "Aluminium", en: "Aluminium", ar: "ألمنيوم" }) },
];
const phaseOptions = (lang: Lang) => [
  { value: "tri" as const, label: t(lang, { fr: "Triphasé", en: "Three-phase", ar: "ثلاثي الطور" }) },
  { value: "mono" as const, label: t(lang, { fr: "Monophasé", en: "Single-phase", ar: "أحادي الطور" }) },
];

/* ── 1. Ohm's law ── */
function OhmCalc() {
  const lang = useLang();
  const [u, setU] = useState("");
  const [i, setI] = useState("12");
  const [r, setR] = useState("20");
  const U = num(u), I = num(i), R = num(r);
  const given = [ok(U), ok(I), ok(R)].filter(Boolean).length;
  let oU = U, oI = I, oR = R;
  if (given >= 2) {
    if (ok(U) && ok(I)) { oR = U / I; }
    else if (ok(U) && ok(R)) { oI = U / R; }
    else if (ok(I) && ok(R)) { oU = R * I; }
  }
  const P = ok(oU) && ok(oI) ? oU * oI : NaN;
  const L = { U: { fr: "Tension U", en: "Voltage U", ar: "الجهد U" }, I: { fr: "Courant I", en: "Current I", ar: "التيار I" }, R: { fr: "Résistance R", en: "Resistance R", ar: "المقاومة R" }, P: { fr: "Puissance P", en: "Power P", ar: "القدرة P" }, hint: { fr: "Entrez deux valeurs, la troisième se calcule.", en: "Enter two values, the third is computed.", ar: "أدخل قيمتين، تُحسب الثالثة." } };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.U)} unit="V" value={u} onChange={setU} />
        <Field label={t(lang, L.I)} unit="A" value={i} onChange={setI} />
        <Field label={t(lang, L.R)} unit="Ω" value={r} onChange={setR} />
      </Grid>
      <p className="mt-3 text-xs text-slate-500">{t(lang, L.hint)}</p>
      {given >= 2 && (
        <Results
          rows={[
            { label: t(lang, L.U), value: fmt(oU), unit: "V" },
            { label: t(lang, L.I), value: fmt(oI), unit: "A" },
            { label: t(lang, L.R), value: fmt(oR), unit: "Ω" },
            { label: t(lang, L.P), value: fmt(P), unit: "W", strong: true },
          ]}
        />
      )}
    </div>
  );
}

/* ── 2. Motor current ── */
function MotorCalc() {
  const lang = useLang();
  const [p, setP] = useState("7.5");
  const [u, setU] = useState("400");
  const [pf, setPf] = useState("0.85");
  const [eff, setEff] = useState("0.9");
  const P = num(p), U = num(u), PF = num(pf), E = num(eff);
  const I = (P * 1000) / (Math.sqrt(3) * U * PF * E);
  const S = Math.sqrt(3) * U * I; // apparent power (VA)
  const L = {
    p: { fr: "Puissance moteur", en: "Motor power", ar: "قدرة المحرك" },
    u: { fr: "Tension (entre phases)", en: "Voltage (line-to-line)", ar: "الجهد (بين الطورين)" },
    pf: { fr: "Facteur de puissance cos φ", en: "Power factor cos φ", ar: "عامل القدرة cos φ" },
    eff: { fr: "Rendement η", en: "Efficiency η", ar: "المردود η" },
    i: { fr: "Courant nominal I", en: "Full-load current I", ar: "التيار الاسمي I" },
    s: { fr: "Puissance apparente S", en: "Apparent power S", ar: "القدرة الظاهرة S" },
    start: { fr: "Démarrage direct (≈ 6×)", en: "DOL start (≈ 6×)", ar: "الإقلاع المباشر (≈ 6×)" },
  };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.p)} unit="kW" value={p} onChange={setP} />
        <Field label={t(lang, L.u)} unit="V" value={u} onChange={setU} />
        <Field label={t(lang, L.pf)} value={pf} onChange={setPf} />
        <Field label={t(lang, L.eff)} value={eff} onChange={setEff} />
      </Grid>
      <Results
        rows={[
          { label: t(lang, L.i), value: fmt(I), unit: "A", strong: true },
          { label: t(lang, L.start), value: fmt(I * 6), unit: "A" },
          { label: t(lang, L.s), value: fmt(S / 1000), unit: "kVA" },
        ]}
      />
    </div>
  );
}

/* ── 3. Cable size ── */
function CableCalc() {
  const lang = useLang();
  const [i, setI] = useState("40");
  const [len, setLen] = useState("50");
  const [u, setU] = useState("400");
  const [drop, setDrop] = useState("5");
  const [pf, setPf] = useState("0.85");
  const [mat, setMat] = useState<"cu" | "al">("cu");
  const [phase, setPhase] = useState<"tri" | "mono">("tri");
  const I = num(i), Len = num(len), U = num(u), D = num(drop), PF = num(pf);
  const k = phase === "tri" ? Math.sqrt(3) : 2;
  const dUmax = (D / 100) * U;
  const sMin = (k * RHO[mat] * Len * I * PF) / dUmax;
  const chosen = SECTIONS.find((s) => s >= sMin) ?? null;
  const L = {
    i: { fr: "Courant", en: "Current", ar: "التيار" },
    len: { fr: "Longueur de la ligne", en: "Line length", ar: "طول الخط" },
    u: { fr: "Tension", en: "Voltage", ar: "الجهد" },
    drop: { fr: "Chute de tension max", en: "Max voltage drop", ar: "أقصى هبوط للجهد" },
    pf: { fr: "cos φ", en: "cos φ", ar: "cos φ" },
    mat: { fr: "Conducteur", en: "Conductor", ar: "الموصل" },
    phase: { fr: "Réseau", en: "Supply", ar: "الشبكة" },
    smin: { fr: "Section minimale calculée", en: "Minimum section", ar: "المقطع الأدنى المحسوب" },
    chosen: { fr: "Section normalisée conseillée", en: "Recommended standard section", ar: "المقطع المعياري المقترح" },
    none: { fr: "> 300 — scinder la ligne", en: "> 300 — split the line", ar: "> 300 — قسّم الخط" },
  };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.i)} unit="A" value={i} onChange={setI} />
        <Field label={t(lang, L.len)} unit="m" value={len} onChange={setLen} />
        <Field label={t(lang, L.u)} unit="V" value={u} onChange={setU} />
        <Field label={t(lang, L.drop)} unit="%" value={drop} onChange={setDrop} />
        <Field label={t(lang, L.pf)} value={pf} onChange={setPf} />
        <Choice label={t(lang, L.mat)} value={mat} onChange={setMat} options={matOptions(lang)} />
        <Choice label={t(lang, L.phase)} value={phase} onChange={setPhase} options={phaseOptions(lang)} />
      </Grid>
      <Results
        rows={[
          { label: t(lang, L.smin), value: fmt(sMin), unit: "mm²" },
          { label: t(lang, L.chosen), value: chosen ? String(chosen) : t(lang, L.none), unit: chosen ? "mm²" : undefined, strong: true },
        ]}
      />
    </div>
  );
}

/* ── 4. Voltage drop ── */
function DropCalc() {
  const lang = useLang();
  const [i, setI] = useState("40");
  const [len, setLen] = useState("50");
  const [s, setS] = useState("16");
  const [u, setU] = useState("400");
  const [pf, setPf] = useState("0.85");
  const [mat, setMat] = useState<"cu" | "al">("cu");
  const [phase, setPhase] = useState<"tri" | "mono">("tri");
  const I = num(i), Len = num(len), S = num(s), U = num(u), PF = num(pf);
  const k = phase === "tri" ? Math.sqrt(3) : 2;
  const dU = (k * RHO[mat] * Len * I * PF) / S;
  const pct = (dU / U) * 100;
  const L = {
    i: { fr: "Courant", en: "Current", ar: "التيار" },
    len: { fr: "Longueur", en: "Length", ar: "الطول" },
    s: { fr: "Section", en: "Section", ar: "المقطع" },
    u: { fr: "Tension", en: "Voltage", ar: "الجهد" },
    pf: { fr: "cos φ", en: "cos φ", ar: "cos φ" },
    mat: { fr: "Conducteur", en: "Conductor", ar: "الموصل" },
    phase: { fr: "Réseau", en: "Supply", ar: "الشبكة" },
    du: { fr: "Chute de tension", en: "Voltage drop", ar: "هبوط الجهد" },
    pct: { fr: "Chute de tension", en: "Voltage drop", ar: "هبوط الجهد" },
    ok: { fr: "Dans la limite (≤ 5 %)", en: "Within limit (≤ 5 %)", ar: "ضمن الحد (≤ 5٪)" },
    high: { fr: "Trop élevée (> 5 %)", en: "Too high (> 5 %)", ar: "مرتفع جداً (> 5٪)" },
  };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.i)} unit="A" value={i} onChange={setI} />
        <Field label={t(lang, L.len)} unit="m" value={len} onChange={setLen} />
        <Field label={t(lang, L.s)} unit="mm²" value={s} onChange={setS} />
        <Field label={t(lang, L.u)} unit="V" value={u} onChange={setU} />
        <Field label={t(lang, L.pf)} value={pf} onChange={setPf} />
        <Choice label={t(lang, L.mat)} value={mat} onChange={setMat} options={matOptions(lang)} />
        <Choice label={t(lang, L.phase)} value={phase} onChange={setPhase} options={phaseOptions(lang)} />
      </Grid>
      <Results
        rows={[
          { label: t(lang, L.du), value: fmt(dU), unit: "V" },
          { label: t(lang, L.pct), value: fmt(pct) + " %", strong: true },
          { label: ok(pct) ? (pct <= 5 ? t(lang, L.ok) : t(lang, L.high)) : "", value: "" },
        ].filter((r) => r.label !== "")}
      />
    </div>
  );
}

/* ── 5. kW ↔ HP ── */
function PowerConvCalc() {
  const lang = useLang();
  const CV = 0.7355;
  const [kw, setKw] = useState("7.5");
  const [cv, setCv] = useState("");
  const setFromKw = (v: string) => { setKw(v); const n = num(v); setCv(ok(n) ? fmt(n / CV, 2) : ""); };
  const setFromCv = (v: string) => { setCv(v); const n = num(v); setKw(ok(n) ? fmt(n * CV, 2) : ""); };
  const L = { kw: { fr: "Puissance", en: "Power", ar: "القدرة" }, cv: { fr: "Puissance", en: "Power", ar: "القدرة" } };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.kw)} unit="kW" value={kw} onChange={setFromKw} />
        <Field label={t(lang, L.cv)} unit="CV" value={cv} onChange={setFromCv} />
      </Grid>
    </div>
  );
}

/* ── 6. Power factor correction ── */
function PfcCalc() {
  const lang = useLang();
  const [p, setP] = useState("100");
  const [pf1, setPf1] = useState("0.75");
  const [pf2, setPf2] = useState("0.95");
  const P = num(p), c1 = num(pf1), c2 = num(pf2);
  const tanFrom = (c: number) => Math.tan(Math.acos(c));
  const qc = P * (tanFrom(c1) - tanFrom(c2));
  const L = {
    p: { fr: "Puissance active", en: "Active power", ar: "القدرة الفعّالة" },
    pf1: { fr: "cos φ actuel", en: "Present cos φ", ar: "cos φ الحالي" },
    pf2: { fr: "cos φ visé", en: "Target cos φ", ar: "cos φ المستهدف" },
    qc: { fr: "Puissance des condensateurs", en: "Capacitor power", ar: "قدرة المكثفات" },
  };
  return (
    <div>
      <Grid>
        <Field label={t(lang, L.p)} unit="kW" value={p} onChange={setP} />
        <Field label={t(lang, L.pf1)} value={pf1} onChange={setPf1} />
        <Field label={t(lang, L.pf2)} value={pf2} onChange={setPf2} />
      </Grid>
      <Results rows={[{ label: t(lang, L.qc), value: fmt(qc), unit: "kVAR", strong: true }]} />
    </div>
  );
}

export const CALCULATORS: Record<string, () => ReactNode> = {
  "loi-ohm": OhmCalc,
  "courant-moteur": MotorCalc,
  "section-cable": CableCalc,
  "chute-tension": DropCalc,
  "conversion-kw-cv": PowerConvCalc,
  "compensation-cos-phi": PfcCalc,
};
