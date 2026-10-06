import { useSyncExternalStore } from "react";
import { select } from "./db";

/**
 * Service pages (/services/<slug>). They are edited in /admin and stored in the "services" table;
 * SERVICE_PAGES below is the built-in copy, used until the database answers or if it can't.
 * Titles and descriptions are repeated in api/_services.js for link previews and the sitemap.
 */

export type ArtKind = "ladder" | "hmi" | "scope" | "panel" | "drive";

export type Service = {
  slug: string;
  title: string;
  summary: string;
  art: ArtKind;
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  specialtiesTitle: string;
  specialties: string[];
  sections: { title: string; paragraphs: string[] }[];
  /** Matched against project titles and descriptions to show related work. */
  keywords: string[];
  /** Preselected "type de besoin" in the quote form on this page. */
  requestType: string;
};

export const SERVICE_PAGES: Service[] = [
  {
    slug: "plc-programming",
    title: "Programmation PLC et IHM",
    summary:
      "Création, modification et mise au point de programmes d’automates et d’écrans opérateur, de la machine simple à la ligne de production complète.",
    art: "hmi",
    seoTitle: "Programmation d’automates PLC et d’écrans IHM en Algérie | MTE",
    seoDescription:
      "Création et modification de programmes PLC et IHM, récupération de programmes perdus, migration d’automates obsolètes : Siemens, Schneider, Omron, Fatek. Intervention partout en Algérie.",
    intro: [
      "L’automate pilote chaque séquence de votre machine ; l’écran IHM donne à l’opérateur les bonnes informations au bon moment. Un programme clair et structuré, c’est une machine plus fiable, plus sûre et plus rapide à dépanner.",
      "Nous intervenons sur des programmes existants comme sur des projets neufs : modification d’un cycle, ajout d’une fonction, récupération d’un programme perdu ou automatisation complète d’une machine.",
    ],
    specialtiesTitle: "Ce que nous faisons",
    specialties: [
      "Création de programmes PLC et d’écrans IHM",
      "Modification et optimisation de programmes existants",
      "Sauvegarde et récupération de programmes perdus",
      "Migration d’automates obsolètes vers une gamme actuelle",
      "Communication entre automates, IHM, variateurs et capteurs",
      "Mise en service et assistance sur site",
    ],
    sections: [
      {
        title: "Les plateformes",
        paragraphs: [
          "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider Electric (Modicon, Zelio), Omron et Fatek, ainsi que les écrans opérateur associés. Pour une autre marque, demandez-nous : nous vous répondons rapidement.",
        ],
      },
      {
        title: "Programme perdu ou automate verrouillé",
        paragraphs: [
          "Quand le programme d’origine n’est plus disponible, nous le récupérons lorsque c’est possible, ou le réécrivons à partir du fonctionnement de la machine. Vous recevez une sauvegarde commentée, pour ne plus dépendre d’une seule copie.",
        ],
      },
      {
        title: "Tester avant d’intervenir",
        paragraphs: [
          "Les séquences peuvent être validées en simulation avant d’être chargées dans la machine. Le temps d’arrêt de la production est réduit au strict nécessaire.",
        ],
      },
    ],
    keywords: ["plc", "automate", "hmi", "ihm", "ktp", "programmation", "tia", "factory io", "et200", "automatisme"],
    requestType: "Programmation PLC / IHM",
  },
  {
    slug: "control-panel-diagnostics",
    title: "Diagnostic et dépannage d’armoires",
    summary:
      "Machine à l’arrêt, défaut intermittent, automate en erreur : recherche méthodique de la panne dans l’armoire de commande et remise en production.",
    art: "scope",
    seoTitle: "Dépannage d’armoires électriques et diagnostic de pannes machines en Algérie | MTE",
    seoDescription:
      "Recherche de pannes sur armoires de commande et machines industrielles : défauts automate, entrées/sorties, capteurs, variateurs, communications. Intervention sur site partout en Algérie.",
    intro: [
      "Une panne d’armoire peut venir d’un capteur, d’un câble, d’un relais, du programme ou de l’automate lui-même. Nous partons des symptômes, lisons l’état de l’automate et des entrées/sorties, et remontons jusqu’à la cause réelle, plutôt que de remplacer des pièces au hasard.",
      "L’objectif : relancer la production rapidement, puis traiter la cause pour que la panne ne revienne pas.",
    ],
    specialtiesTitle: "Ce que nous vérifions",
    specialties: [
      "Défauts de l’automate et lecture du programme en ligne",
      "Entrées/sorties, capteurs, fins de course et sécurités",
      "Relais, contacteurs, protections et alimentations",
      "Défauts de variateurs et de démarreurs",
      "Communications entre automate, IHM et équipements",
      "Pannes intermittentes et défauts récurrents",
    ],
    sections: [
      {
        title: "Sur site, partout en Algérie",
        paragraphs: [
          "Nous venons avec le matériel de mesure et le logiciel adapté à votre automate. Un premier échange par téléphone ou WhatsApp (photos de l’armoire, code défaut affiché) permet souvent de préparer l’intervention avant le déplacement.",
          "À la fin de l’intervention, vous recevez un bon d’intervention qui décrit la panne trouvée, ce qui a été fait et les recommandations éventuelles.",
        ],
      },
      {
        title: "Et si une carte électronique est en cause ?",
        paragraphs: [
          "Quand le défaut vient d’une carte (automate, variateur, alimentation), nous vous présentons les options : remplacement par un équivalent disponible, ou réparation lorsque c’est la solution la plus rapide pour relancer la machine.",
        ],
      },
    ],
    keywords: ["diagnostic", "dépannage", "panne", "défaut", "remise en service", "armoire", "eeprom"],
    requestType: "Machine ou armoire en panne",
  },
  {
    slug: "control-automation",
    title: "Conception et rétrofit d’armoires",
    summary:
      "Armoires de commande conçues sur mesure selon votre cahier des charges, et modernisation des installations existantes.",
    art: "panel",
    seoTitle: "Conception d’armoires de commande et rétrofit d’automatismes en Algérie | MTE",
    seoDescription:
      "Étude, réalisation et mise en service d’armoires de commande sur mesure. Rétrofit d’automates et d’IHM obsolètes, intégration de variateurs et supervision. Médéa et toute l’Algérie.",
    intro: [
      "Chaque machine a ses contraintes : cadence, sécurité, environnement, budget. Nous concevons des armoires de commande pensées pour votre installation, avec du matériel disponible en Algérie pour une maintenance simple dans la durée.",
      "De l’étude jusqu’à la mise en service sur site, un seul interlocuteur suit le projet : les choix techniques sont expliqués et chaque étape est validée avec vous.",
    ],
    specialtiesTitle: "Nos prestations",
    specialties: [
      "Étude, schémas et choix du matériel",
      "Réalisation et câblage d’armoires de commande",
      "Rétrofit : remplacement d’automates et d’IHM obsolètes",
      "Intégration de variateurs, démarreurs et sécurités",
      "Supervision et remontée d’informations",
      "Installation et mise en service sur site",
    ],
    sections: [
      {
        title: "Du cahier des charges à la mise en service",
        paragraphs: [
          "Nous partons du fonctionnement attendu : entrées et sorties, sécurités, modes de marche, interface opérateur. L’armoire est câblée et testée avant l’installation, puis mise en service avec vos équipes.",
        ],
      },
      {
        title: "Moderniser plutôt que remplacer",
        paragraphs: [
          "Automate obsolète, pièces introuvables, pannes répétées : un rétrofit remplace la partie commande en conservant la mécanique de la machine. C’est souvent la solution la plus économique pour prolonger la vie d’une ligne de production.",
        ],
      },
    ],
    keywords: ["rétrofit", "retrofit", "armoire", "upgrade", "modernisation", "installation", "scada"],
    requestType: "Nouvelle armoire / rétrofit",
  },
  {
    slug: "drives-commissioning",
    title: "Variateurs et mise en service",
    summary:
      "Paramétrage, intégration et remplacement de variateurs de fréquence et de démarreurs progressifs, jusqu’aux essais de la machine.",
    art: "drive",
    seoTitle: "Paramétrage et mise en service de variateurs de fréquence en Algérie | MTE",
    seoDescription:
      "Paramétrage et intégration de variateurs ABB, Schneider Altivar, Siemens, Danfoss, LS. Remplacement par un équivalent disponible, liaison avec l’automate, essais et mise en service.",
    intro: [
      "Un variateur mal réglé use le moteur, se met en défaut ou limite la production. Nous paramétrons et intégrons vos variateurs : rampes, protections, régulation, commande par l’automate.",
      "Quand un variateur est hors service ou introuvable, nous le remplaçons par un modèle disponible et reprenons le paramétrage pour que la machine fonctionne comme avant.",
    ],
    specialtiesTitle: "Nos interventions",
    specialties: [
      "Paramétrage de variateurs ABB, Schneider, Siemens, Danfoss, LS…",
      "Remplacement par un équivalent disponible",
      "Commande par l’automate, câblée ou en réseau",
      "Démarreurs progressifs et commandes moteur",
      "Analyse des défauts variateur",
      "Essais et mise en service",
    ],
    sections: [
      {
        title: "Remplacer sans changer votre process",
        paragraphs: [
          "Nous relevons les réglages de l’ancien variateur quand c’est possible, choisissons un modèle adapté au moteur et à l’application, puis reprenons le câblage et le paramétrage. La machine redémarre avec le même comportement.",
        ],
      },
      {
        title: "Essais et réglages",
        paragraphs: [
          "Chaque mise en service se termine par des essais en conditions réelles : sens de rotation, rampes, protections, sécurités. Les réglages importants sont notés pour vos futures interventions.",
        ],
      },
    ],
    keywords: ["variateur", "vfd", "altivar", "atv", "acs", "drive", "démarreur", "paramétrage"],
    requestType: "Variateur / mise en service",
  },
];

export const ART_KINDS: { value: ArtKind; label: string }[] = [
  { value: "ladder", label: "Schéma à contacts (ladder)" },
  { value: "hmi", label: "Écran opérateur (IHM)" },
  { value: "scope", label: "Oscilloscope / diagnostic" },
  { value: "panel", label: "Armoire de commande" },
  { value: "drive", label: "Variateur et moteur" },
];

/** Built-in services that have their own link-preview image. */
export function ogImageFor(slug: string) {
  return SERVICE_PAGES.some((s) => s.slug === slug) ? `/images/web/og-${slug}.png` : "/images/web/og-default.png";
}

export type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  art: ArtKind;
  seo_title: string;
  seo_description: string;
  intro: string[];
  specialties_title: string;
  specialties: string[];
  sections: { title: string; paragraphs: string[] }[];
  keywords: string[];
  request_type: string;
  sort_order: number;
  published: boolean;
};

export function fromRow(r: ServiceRow): Service {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    art: r.art,
    seoTitle: r.seo_title || `${r.title} | MTE Algérie`,
    seoDescription: r.seo_description || r.summary,
    intro: r.intro ?? [],
    specialtiesTitle: r.specialties_title,
    specialties: r.specialties ?? [],
    sections: r.sections ?? [],
    keywords: r.keywords ?? [],
    requestType: r.request_type,
  };
}

// --- Live list: last known copy first (browser cache or built-in), then the database. ---

const CACHE_KEY = "mte-services-v1";
type Snapshot = { services: Service[]; loaded: boolean };

function readCache(): Service[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Service[]) : null;
  } catch {
    return null;
  }
}

let snapshot: Snapshot = { services: readCache() ?? SERVICE_PAGES, loaded: false };
const listeners = new Set<() => void>();
let started = false;

function load() {
  if (started) return;
  started = true;
  select<ServiceRow>("services", { select: "*", order: "sort_order.asc" }).then((rows) => {
    const services = rows.length ? rows.map(fromRow) : snapshot.services;
    snapshot = { services, loaded: true };
    try {
      if (rows.length) localStorage.setItem(CACHE_KEY, JSON.stringify(services));
    } catch {
      // Storage unavailable: the list is simply fetched again next visit.
    }
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Published services in display order, kept up to date with the database. */
export function useServices(): Snapshot {
  load();
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
