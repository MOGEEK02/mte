import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Gauge,
  Settings2,
  MonitorSmartphone,
  Workflow,
  Wrench,
  CircuitBoard,
  PlugZap,
  Radio,
  Code2,
} from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";

const GROUP1_ICONS: LucideIcon[] = [Cpu, Gauge, Settings2, MonitorSmartphone, Workflow];
const GROUP2_ICONS: LucideIcon[] = [Wrench, CircuitBoard, Code2, PlugZap, Radio];

function Card({
  Icon,
  title,
  description,
  highlight,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        highlight
          ? "border-slate-200 bg-white hover:border-brand/40"
          : "border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          highlight
            ? "bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white"
            : "bg-slate-200/70 text-slate-600 group-hover:bg-slate-800 group-hover:text-white"
        }`}
      >
        <Icon size={24} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

export default function ExpertiseSection() {
  const { t } = useLang();

  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="container-mte">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title mt-3">{t.services.title}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {t.services.intro}
          </p>
        </div>

        {/* Group 1 — Programming (highlighted) */}
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <h3 className="text-xl font-extrabold text-ink">
              {t.services.group1Title}
            </h3>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
              {t.services.group1Subtitle}
            </span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.group1.map((s, i) => (
              <Card
                key={s.title}
                Icon={GROUP1_ICONS[i] ?? Cpu}
                title={s.title}
                description={s.description}
                highlight
              />
            ))}
          </div>
        </div>

        {/* Group 2 — Repair */}
        <div className="mt-16">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <h3 className="text-xl font-extrabold text-ink">
              {t.services.group2Title}
            </h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {t.services.group2Subtitle}
            </span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.group2.map((s, i) => (
              <Card
                key={s.title}
                Icon={GROUP2_ICONS[i] ?? Wrench}
                title={s.title}
                description={s.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
