import { useSyncExternalStore } from "react";
import { select } from "./db";

/**
 * Service cards on the home page. They are edited in /admin → Services ("services" table);
 * DEFAULT_SERVICES is the built-in copy, used until the database answers or if it can't.
 */
export type Service = {
  slug: string;
  title: string;
  summary: string;
  /** Short line under the text: brands, scope… */
  tagline: string;
  image: string;
};

export const DEFAULT_SERVICES: Service[] = [
  {
    slug: "plc-programming",
    title: "Programmation PLC et IHM",
    summary:
      "Création, modification et mise au point de programmes d’automates et d’écrans opérateur. Récupération de programmes perdus et migration d’automates obsolètes.",
    tagline: "Siemens S7 · TIA Portal · Modicon · Omron · Fatek",
    image: "/images/web/ihm.webp",
  },
  {
    slug: "control-panel-diagnostics",
    title: "Dépannage d’armoires de commande",
    summary:
      "Machine à l’arrêt ou défaut intermittent : recherche méthodique de la panne dans l’armoire (automate, entrées/sorties, capteurs, relais) et remise en production.",
    tagline: "Intervention sur site partout en Algérie",
    image: "/images/web/automates.webp",
  },
  {
    slug: "electrical-study",
    title: "Études électriques",
    summary:
      "Schémas électriques, bilan de puissance, choix des protections et des câbles, conception d’armoires de commande et rétrofit d’installations existantes.",
    tagline: "Armoires · protections · rétrofit",
    image: "/images/web/fondateur-site.webp",
  },
  {
    slug: "drives-repair",
    title: "Variateurs de vitesse (VFD)",
    summary:
      "Diagnostic, réparation, paramétrage et remplacement de variateurs AC/DC et de démarreurs progressifs, de 0,37 kW à plus de 500 kW.",
    tagline: "ABB · Schneider Altivar · Siemens · Danfoss · LS",
    image: "/images/web/variateurs.webp",
  },
  {
    slug: "electronic-repair",
    title: "Réparation de cartes électroniques",
    summary:
      "Réparation au niveau composant des cartes de commande et de puissance, rétro-ingénierie quand le schéma n’existe pas.",
    tagline: "Cartes de commande et de puissance",
    image: "/images/web/cartes.webp",
  },
  {
    slug: "power-sensors",
    title: "Alimentations et capteurs",
    summary:
      "Alimentations AC/DC, onduleurs et stabilisateurs de tension ; diagnostic et remplacement de capteurs et de transmetteurs.",
    tagline: "Alimentations · capteurs · instrumentation",
    image: "/images/web/alimentations.webp",
  },
];

export type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  tagline: string | null;
  image: string | null;
  sort_order: number;
  published: boolean;
};

export function fromRow(r: ServiceRow): Service {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    tagline: r.tagline ?? "",
    image: r.image || DEFAULT_SERVICES.find((s) => s.slug === r.slug)?.image || "/images/web/automates.webp",
  };
}

// --- Live list: last known copy first (browser cache or built-in), then the database. ---

const CACHE_KEY = "mte-services-v2";

function readCache(): Service[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Service[]) : null;
  } catch {
    return null;
  }
}

let snapshot: Service[] = readCache() ?? DEFAULT_SERVICES;
const listeners = new Set<() => void>();
let started = false;

function load() {
  if (started) return;
  started = true;
  select<ServiceRow>("services", { select: "slug,title,summary,tagline,image,sort_order,published", order: "sort_order.asc" }).then((rows) => {
    if (!rows.length) return;
    snapshot = rows.map(fromRow);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage unavailable: fetched again next visit.
    }
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Published services in display order, kept up to date with the database. */
export function useServices(): Service[] {
  load();
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
