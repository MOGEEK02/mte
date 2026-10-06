// Service pages for the server (link previews in api/page.js, URLs in api/sitemap.js).
// They come from the "services" table (edited in /admin); SERVICES below is the built-in
// copy used when the database can't be read. Files starting with "_" are not deployed as functions.

export const SERVICES_PAGE = {
  title: 'Services – programmation PLC, dépannage d’armoires, rétrofit, variateurs | MTE Algérie',
  description:
    'Programmation d’automates et d’écrans IHM, diagnostic et dépannage d’armoires de commande, conception et rétrofit, paramétrage de variateurs. Médéa et toute l’Algérie.',
};

export const SERVICES = [
  {
    slug: 'plc-programming',
    title: 'Programmation d’automates PLC et d’écrans IHM en Algérie | MTE',
    description:
      'Création et modification de programmes PLC et IHM, récupération de programmes perdus, migration d’automates obsolètes : Siemens, Schneider, Omron, Fatek. Intervention partout en Algérie.',
  },
  {
    slug: 'control-panel-diagnostics',
    title: 'Dépannage d’armoires électriques et diagnostic de pannes machines en Algérie | MTE',
    description:
      'Recherche de pannes sur armoires de commande et machines industrielles : défauts automate, entrées/sorties, capteurs, variateurs, communications. Intervention sur site partout en Algérie.',
  },
  {
    slug: 'control-automation',
    title: 'Conception d’armoires de commande et rétrofit d’automatismes en Algérie | MTE',
    description:
      'Étude, réalisation et mise en service d’armoires de commande sur mesure. Rétrofit d’automates et d’IHM obsolètes, intégration de variateurs et supervision. Médéa et toute l’Algérie.',
  },
  {
    slug: 'drives-commissioning',
    title: 'Paramétrage et mise en service de variateurs de fréquence en Algérie | MTE',
    description:
      'Paramétrage et intégration de variateurs ABB, Schneider Altivar, Siemens, Danfoss, LS. Remplacement par un équivalent disponible, liaison avec l’automate, essais et mise en service.',
  },
].map((s) => ({ ...s, image: `/images/web/og-${s.slug}.png` }));

const DEFAULT_IMAGE = '/images/web/og-default.png';

/** Published services from the database, or the built-in list. */
export async function liveServices() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return SERVICES;
  try {
    const res = await fetch(`${url}/rest/v1/services?select=slug,title,summary,seo_title,seo_description&order=sort_order.asc`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(4000),
    });
    const rows = res.ok ? await res.json() : [];
    if (!Array.isArray(rows) || rows.length === 0) return SERVICES;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.seo_title || `${r.title} | MTE Algérie`,
      description: r.seo_description || r.summary,
      image: SERVICES.find((s) => s.slug === r.slug)?.image ?? DEFAULT_IMAGE,
    }));
  } catch {
    return SERVICES;
  }
}
