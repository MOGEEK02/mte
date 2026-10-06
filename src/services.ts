/**
 * The four service pages (/services/<slug>).
 * Titles, descriptions and images are repeated in api/_services.js for link previews and the sitemap.
 */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  specialtiesTitle: string;
  specialties: string[];
  sections: { title: string; paragraphs: string[] }[];
  /** Matched against project titles and descriptions to show related work. */
  keywords: string[];
  /** Preselected in the quote form on this page. */
  quoteEquipment: string;
};

export const SERVICE_PAGES: Service[] = [
  {
    slug: "control-automation",
    title: "Contrôle et automatisme",
    summary:
      "Armoires de commande conçues et réalisées sur mesure, selon votre cahier des charges et vos contraintes, avec un niveau de qualité adapté à chaque budget.",
    image: "/images/web/service-automatisme.webp",
    imageAlt: "Automate Schneider M221 câblé dans une armoire de commande",
    seoTitle: "Armoires de commande et automatisme industriel en Algérie | MTE",
    seoDescription:
      "Conception, câblage et mise en service d’armoires de commande sur mesure, programmation PLC/IHM, supervision SCADA et intégration de variateurs. Médéa et toute l’Algérie.",
    intro: [
      "Chaque machine a ses contraintes : cadence, sécurité, environnement, budget. Nous concevons des armoires de commande pensées pour votre installation, pas des solutions standard adaptées après coup.",
      "De l’étude des besoins jusqu’à la mise en service sur site, un seul interlocuteur suit le projet : les choix techniques sont expliqués et chaque étape est validée avec vous.",
    ],
    specialtiesTitle: "Nos spécialités",
    specialties: [
      "Conception, réalisation, installation et mise en service d’armoires de commande",
      "Programmation et mise au point d’automates (PLC) et d’écrans IHM",
      "Conception et installation de systèmes de supervision (SCADA)",
      "Intégration de variateurs de fréquence, démarreurs progressifs et séquenceurs",
    ],
    sections: [
      {
        title: "Du cahier des charges à la mise en service",
        paragraphs: [
          "Nous partons du fonctionnement attendu de la machine : entrées et sorties, sécurités, modes de marche, interface opérateur. Le choix du matériel suit vos préférences de marque et la disponibilité des pièces en Algérie, pour une maintenance simple dans la durée.",
          "L’armoire est câblée et testée avant l’installation, puis mise en service sur site avec vos équipes. Le programme est sauvegardé et les modifications sont documentées.",
        ],
      },
      {
        title: "Moderniser une installation existante",
        paragraphs: [
          "Automate obsolète, pièces introuvables, pannes répétées : un rétrofit remplace l’électronique de commande en conservant la mécanique de la machine. C’est souvent la solution la plus économique pour prolonger la vie d’une ligne de production.",
        ],
      },
    ],
    keywords: ["armoire", "rétrofit", "retrofit", "automatisme", "scada", "plc", "api ", "et200", "upgrade"],
    quoteEquipment: "Automate (PLC)",
  },
  {
    slug: "installation",
    title: "Installation et mise en service",
    summary:
      "Armoires industrielles, variateurs, moteurs ou projets sur mesure : nous installons, raccordons et mettons en service vos équipements électriques.",
    image: "/images/web/service-installation.webp",
    imageAlt: "Variateur ABB ACS150 installé dans une armoire électrique",
    seoTitle: "Installation électrique industrielle et mise en service en Algérie | MTE",
    seoDescription:
      "Installation et raccordement d’armoires industrielles, variateurs, démarreurs progressifs, moteurs, automates et IHM. Câblage de puissance et de commande, mise en service sur site partout en Algérie.",
    intro: [
      "Un équipement bien choisi peut mal fonctionner s’il est mal installé. Nous prenons en charge l’installation complète : pose, câblage, paramétrage et essais, jusqu’au redémarrage de la production.",
      "Nous intervenons sur site partout en Algérie, sur des installations neuves comme sur le remplacement d’un équipement existant.",
    ],
    specialtiesTitle: "Nos interventions",
    specialties: [
      "Armoires industrielles et tableaux de distribution",
      "Démarreurs progressifs, variateurs de fréquence et variateurs DC",
      "Moteurs et codeurs",
      "Câblage de puissance et de commande",
      "Automates (PLC) et écrans IHM",
      "Projets sur mesure, de l’étude à la mise en service",
    ],
    sections: [
      {
        title: "Remplacement d’équipements",
        paragraphs: [
          "Quand un variateur ou un automate n’est plus réparable ou plus fabriqué, nous proposons un équivalent disponible, l’installons et reprenons le paramétrage pour que la machine fonctionne comme avant, sans modification de votre process.",
        ],
      },
      {
        title: "Mise en service et essais",
        paragraphs: [
          "Chaque installation se termine par des essais en conditions réelles : sens de rotation, rampes, protections, sécurités. Les réglages importants vous sont expliqués et notés pour vos futures interventions.",
        ],
      },
    ],
    keywords: ["installation", "remplacement", "paramétrage", "mise en service", "configuration"],
    quoteEquipment: "Variateur de vitesse",
  },
  {
    slug: "electronic-repairs",
    title: "Réparation électronique",
    summary:
      "Réparation au niveau composant des équipements industriels : automates, variateurs AC et DC, capteurs, alimentations et bien plus.",
    image: "/images/web/service-reparation.webp",
    imageAlt: "Variateur de vitesse ouvert sur l’établi, carte électronique visible",
    seoTitle: "Réparation électronique industrielle : variateurs, automates, cartes | MTE Algérie",
    seoDescription:
      "Réparation au niveau composant de variateurs AC/DC, automates, écrans IHM, capteurs, convertisseurs DC-DC et démarreurs progressifs. Diagnostic sous 24 à 48 h, devis avant réparation.",
    intro: [
      "Remplacer un module complet coûte cher et les délais d’importation peuvent bloquer une ligne pendant des semaines. Nous réparons au niveau composant : la pièce défaillante est identifiée et remplacée, la carte d’origine retourne en service.",
      "Le diagnostic est réalisé sous 24 à 48 heures, et vous recevez un devis avant toute réparation.",
    ],
    specialtiesTitle: "Équipements que nous réparons",
    specialties: [
      "Automates (PLC) et écrans IHM",
      "Variateurs AC et DC, codeurs",
      "Capteurs, transmetteurs, interfaces sur mesure et convertisseurs DC-DC",
      "Variateurs de vitesse (ASD / VSD) et cartes de démarreurs progressifs",
      "Alimentations, onduleurs et stabilisateurs de tension",
    ],
    sections: [
      {
        title: "Quand il n’y a pas de schéma",
        paragraphs: [
          "Beaucoup de cartes industrielles sont livrées sans documentation. Nous relevons le circuit, identifions les composants et, si nécessaire, réalisons une rétro-ingénierie de la carte pour la réparer ou la reproduire.",
        ],
      },
      {
        title: "Tests avant restitution",
        paragraphs: [
          "Chaque équipement réparé est testé avant d’être rendu : mise sous tension progressive, contrôle des alimentations et essai de fonctionnement. Nous vous indiquons la cause probable de la panne pour éviter qu’elle ne se reproduise.",
        ],
      },
    ],
    keywords: ["réparation", "repair", "pcb", "carte", "eeprom", "stabilisateur", "variateur", "restauration"],
    quoteEquipment: "Carte électronique",
  },
  {
    slug: "plc-hmi-programming",
    title: "Programmation PLC et IHM",
    summary:
      "De la machine simple à la ligne de production complète : programmation, intégration et mise au point d’automates et d’écrans opérateur.",
    image: "/images/web/service-programmation.webp",
    imageAlt: "Ordinateur portable connecté à un automate pour la programmation",
    seoTitle: "Programmation d’automates PLC et d’écrans IHM en Algérie | MTE",
    seoDescription:
      "Programmation, intégration, réparation et maintenance d’automates PLC et d’écrans IHM : Siemens, Schneider, Omron, Fatek. Projets sur mesure et maintenance sur site partout en Algérie.",
    intro: [
      "L’automate et l’écran opérateur sont au cœur d’une ligne de production : ils pilotent chaque séquence et donnent à vos opérateurs les informations dont ils ont besoin. Un programme clair et bien structuré, c’est une machine plus fiable et plus facile à dépanner.",
      "Nous intervenons sur des projets de toutes tailles, de la modification d’un programme existant à l’automatisation complète d’une ligne.",
    ],
    specialtiesTitle: "Un service complet",
    specialties: [
      "Programmation d’automates et d’écrans IHM",
      "Intégration avec variateurs, capteurs et équipements existants",
      "Réparation d’automates et d’écrans",
      "Armoires complètes sur mesure et installation",
      "Maintenance sur site après la mise en service",
      "Mise hors service des systèmes qui ne sont plus utilisés",
    ],
    sections: [
      {
        title: "Les plateformes que nous utilisons",
        paragraphs: [
          "Siemens (S7, TIA Portal, LOGO!), Schneider Electric (Modicon), Omron, Fatek et d’autres marques courantes dans l’industrie algérienne. Programme perdu ou automate verrouillé : nous pouvons souvent récupérer ou réécrire le programme à partir du fonctionnement de la machine.",
        ],
      },
      {
        title: "Préparer la suite",
        paragraphs: [
          "Les automates actuels permettent bien plus que la commande de la machine : remontée de données de production, maintenance préventive, supervision à distance. Lors d’une modernisation, nous étudions avec vous ce qui est réellement utile pour votre installation, pour réduire les arrêts sans complexité inutile.",
        ],
      },
    ],
    keywords: ["plc", "api ", "automate", "hmi", "ihm", "ktp", "programmation", "tia", "factory io", "eeprom"],
    quoteEquipment: "Automate (PLC)",
  },
];

export function findService(slug: string) {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
