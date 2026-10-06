import { select } from "./db";
import type { Lang } from "./i18n";
import { createStore } from "./store";

/**
 * Service cards on the home page. They are edited in /admin → Services ("services" table);
 * DEFAULT_SERVICES is the built-in copy, used until the database answers or if it can't.
 */
type Text = { title: string; summary: string; tagline: string };
export type Service = { slug: string; image: string } & Record<Lang, Text>;

export const DEFAULT_SERVICES: Service[] = [
  {
    slug: "plc-programming",
    image: "/images/web/ihm.webp",
    fr: {
      title: "Programmation PLC et IHM",
      summary:
        "Création, modification et mise au point de programmes d’automates et d’écrans opérateur. Récupération de programmes perdus et migration d’automates obsolètes.",
      tagline: "Siemens S7 · TIA Portal · Modicon · Omron · Fatek",
    },
    en: {
      title: "PLC and HMI programming",
      summary:
        "Writing, modifying and commissioning PLC and operator-panel programs. Recovery of lost programs and migration of obsolete PLCs.",
      tagline: "Siemens S7 · TIA Portal · Modicon · Omron · Fatek",
    },
    ar: {
      title: "برمجة المتحكمات PLC وواجهات HMI",
      summary:
        "كتابة وتعديل وضبط برامج المتحكمات المنطقية وشاشات التشغيل. استرجاع البرامج الضائعة وترحيل المتحكمات القديمة إلى أجيال حديثة.",
      tagline: "Siemens S7 · TIA Portal · Modicon · Omron · Fatek",
    },
  },
  {
    slug: "control-panel-diagnostics",
    image: "/images/web/automates.webp",
    fr: {
      title: "Dépannage d’armoires de commande",
      summary:
        "Machine à l’arrêt ou défaut intermittent : recherche méthodique de la panne dans l’armoire (automate, entrées/sorties, capteurs, relais) et remise en production.",
      tagline: "Intervention sur site partout en Algérie",
    },
    en: {
      title: "Control panel troubleshooting",
      summary:
        "Machine down or intermittent fault: methodical fault finding in the panel (PLC, inputs/outputs, sensors, relays) and return to production.",
      tagline: "On-site service across Algeria",
    },
    ar: {
      title: "تصليح أعطال خزائن التحكم",
      summary:
        "آلة متوقفة أو عطل متقطع: بحث منهجي عن العطل داخل الخزانة (المتحكم، المداخل والمخارج، الحساسات، المرحلات) وإعادة الإنتاج.",
      tagline: "تدخل في الموقع عبر كامل الجزائر",
    },
  },
  {
    slug: "electrical-study",
    image: "/images/web/fondateur-site.webp",
    fr: {
      title: "Études électriques",
      summary:
        "Schémas électriques, bilan de puissance, choix des protections et des câbles, conception d’armoires de commande et rétrofit d’installations existantes.",
      tagline: "Armoires · protections · rétrofit",
    },
    en: {
      title: "Electrical design studies",
      summary:
        "Wiring diagrams, power balance, selection of protection devices and cables, control panel design and retrofit of existing installations.",
      tagline: "Panels · protection · retrofit",
    },
    ar: {
      title: "الدراسات الكهربائية",
      summary:
        "المخططات الكهربائية، حصيلة القدرة، اختيار أجهزة الحماية والكوابل، تصميم خزائن التحكم وتحديث التركيبات القائمة.",
      tagline: "الخزائن · الحماية · التحديث",
    },
  },
  {
    slug: "drives-repair",
    image: "/images/web/variateurs.webp",
    fr: {
      title: "Variateurs de vitesse (VFD)",
      summary:
        "Diagnostic, réparation, paramétrage et remplacement de variateurs AC/DC et de démarreurs progressifs, de 0,37 kW à plus de 500 kW.",
      tagline: "ABB · Schneider Altivar · Siemens · Danfoss · LS",
    },
    en: {
      title: "Variable frequency drives (VFD)",
      summary:
        "Diagnosis, repair, parameter setup and replacement of AC/DC drives and soft starters, from 0.37 kW to over 500 kW.",
      tagline: "ABB · Schneider Altivar · Siemens · Danfoss · LS",
    },
    ar: {
      title: "مغيرات السرعة (VFD)",
      summary:
        "تشخيص وتصليح وضبط واستبدال مغيرات السرعة AC/DC والمشغلات التدريجية، من 0,37 كيلوواط إلى أكثر من 500 كيلوواط.",
      tagline: "ABB · Schneider Altivar · Siemens · Danfoss · LS",
    },
  },
  {
    slug: "electronic-repair",
    image: "/images/web/cartes.webp",
    fr: {
      title: "Réparation de cartes électroniques",
      summary:
        "Réparation au niveau composant des cartes de commande et de puissance, rétro-ingénierie quand le schéma n’existe pas.",
      tagline: "Cartes de commande et de puissance",
    },
    en: {
      title: "Electronic board repair",
      summary:
        "Component-level repair of control and power boards, with reverse engineering when no schematic exists.",
      tagline: "Control and power boards",
    },
    ar: {
      title: "تصليح البطاقات الإلكترونية",
      summary: "تصليح على مستوى المكونات لبطاقات التحكم والقدرة، مع الهندسة العكسية عند غياب المخطط.",
      tagline: "بطاقات التحكم والقدرة",
    },
  },
  {
    slug: "power-sensors",
    image: "/images/web/alimentations.webp",
    fr: {
      title: "Alimentations et capteurs",
      summary:
        "Alimentations AC/DC, onduleurs et stabilisateurs de tension ; diagnostic et remplacement de capteurs et de transmetteurs.",
      tagline: "Alimentations · capteurs · instrumentation",
    },
    en: {
      title: "Power supplies and sensors",
      summary:
        "AC/DC power supplies, UPS units and voltage stabilisers; diagnosis and replacement of sensors and transmitters.",
      tagline: "Power supplies · sensors · instrumentation",
    },
    ar: {
      title: "مزودات الطاقة والحساسات",
      summary: "مزودات الطاقة AC/DC، أجهزة UPS ومنظمات الجهد؛ تشخيص واستبدال الحساسات والمرسلات.",
      tagline: "مزودات الطاقة · الحساسات · أجهزة القياس",
    },
  },
];

export type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  tagline: string | null;
  title_en?: string | null;
  summary_en?: string | null;
  tagline_en?: string | null;
  title_ar?: string | null;
  summary_ar?: string | null;
  tagline_ar?: string | null;
  image: string | null;
  sort_order: number;
  published: boolean;
};

export function fromRow(r: ServiceRow): Service {
  const builtIn = DEFAULT_SERVICES.find((s) => s.slug === r.slug);
  const fr = { title: r.title, summary: r.summary, tagline: r.tagline ?? "" };
  // Other languages fall back to the built-in translation, then to French.
  const translated = (lang: "en" | "ar"): Text => ({
    title: r[`title_${lang}`] || builtIn?.[lang].title || fr.title,
    summary: r[`summary_${lang}`] || builtIn?.[lang].summary || fr.summary,
    tagline: r[`tagline_${lang}`] || builtIn?.[lang].tagline || fr.tagline,
  });
  return {
    slug: r.slug,
    image: r.image || builtIn?.image || "/images/web/automates.webp",
    fr,
    en: translated("en"),
    ar: translated("ar"),
  };
}

/** Raw rows ("*" so the query works before and after columns are added). */
export async function fetchServices(): Promise<Service[] | undefined> {
  const rows = await select<ServiceRow>("services", { select: "*", order: "sort_order.asc" });
  return rows.length ? rows.map(fromRow) : undefined;
}

export const servicesStore = createStore<Service[]>({ key: "services", fallback: DEFAULT_SERVICES, load: fetchServices });

/** Published services in display order, in the page's language. */
export function useServices(lang: Lang): (Text & { slug: string; image: string })[] {
  return servicesStore.use().map((s) => ({ slug: s.slug, image: s.image, ...s[lang] }));
}
