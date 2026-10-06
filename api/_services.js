// Service pages known to the server (link previews in api/page.js, URLs in api/sitemap.js).
// Files starting with "_" are not deployed as functions. Keep in sync with src/services.ts.

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
