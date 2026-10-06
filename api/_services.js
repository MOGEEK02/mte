// Service pages known to the server (link previews in api/page.js, URLs in api/sitemap.js).
// Files starting with "_" are not deployed as functions. Keep in sync with src/services.ts.

export const SERVICES_PAGE = {
  title: 'Services – automatisme, installation, réparation, programmation | MTE Algérie',
  description:
    'Armoires de commande sur mesure, installation et mise en service, réparation électronique au niveau composant, programmation d’automates et d’écrans IHM. Médéa et toute l’Algérie.',
};

export const SERVICES = [
  {
    slug: 'control-automation',
    title: 'Armoires de commande et automatisme industriel en Algérie | MTE',
    description:
      'Conception, câblage et mise en service d’armoires de commande sur mesure, programmation PLC/IHM, supervision SCADA et intégration de variateurs. Médéa et toute l’Algérie.',
    image: '/images/web/og-control-automation.jpg',
  },
  {
    slug: 'installation',
    title: 'Installation électrique industrielle et mise en service en Algérie | MTE',
    description:
      'Installation et raccordement d’armoires industrielles, variateurs, démarreurs progressifs, moteurs, automates et IHM. Câblage de puissance et de commande, mise en service sur site partout en Algérie.',
    image: '/images/web/og-installation.jpg',
  },
  {
    slug: 'electronic-repairs',
    title: 'Réparation électronique industrielle : variateurs, automates, cartes | MTE Algérie',
    description:
      'Réparation au niveau composant de variateurs AC/DC, automates, écrans IHM, capteurs, convertisseurs DC-DC et démarreurs progressifs. Diagnostic sous 24 à 48 h, devis avant réparation.',
    image: '/images/web/og-electronic-repairs.jpg',
  },
  {
    slug: 'plc-hmi-programming',
    title: 'Programmation d’automates PLC et d’écrans IHM en Algérie | MTE',
    description:
      'Programmation, intégration, réparation et maintenance d’automates PLC et d’écrans IHM : Siemens, Schneider, Omron, Fatek. Projets sur mesure et maintenance sur site partout en Algérie.',
    image: '/images/web/og-plc-hmi-programming.jpg',
  },
];
