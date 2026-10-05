// French dictionary — source of truth for the Dictionary type.
// The English dictionary (en.ts) must mirror this shape (same keys, same array lengths & slugs).

const fr = {
  /* ───────────── SEO / <head> ───────────── */
  meta: {
    title:
      "Réparation & Automatisme Industriel en Algérie | VFD, PLC, Groupes Électrogènes – MTE",
    description:
      "MTE – Réparation et programmation d'équipements industriels en Algérie : variateurs de vitesse (VFD), automates (PLC), cartes électroniques, armoires de commande, groupes électrogènes et machines. Dépannage sur site et en atelier, partout en Algérie.",
    keywords:
      "réparation VFD Algérie, réparation variateur de vitesse, programmation automate PLC Algérie, programmation Siemens TIA Portal, réparation carte électronique industrielle, réparation armoire électrique, installation groupe électrogène Algérie, réparation groupe électrogène, dépannage machine industrielle, automatisme industriel Algérie, Médéa",
    ogTitle:
      "MTE – Réparation & Automatisme Industriel en Algérie (VFD, PLC, Groupes Électrogènes)",
    ogDescription:
      "Dépannage, programmation et installation d'équipements industriels partout en Algérie. Variateurs, automates, cartes électroniques, armoires, groupes électrogènes et machines.",
  },

  /* ───────────── Navigation ───────────── */
  nav: {
    home: "Accueil",
    services: "Services",
    portfolio: "Réalisations",
    process: "Méthode",
    faq: "FAQ",
    contact: "Contact",
    quote: "Devis",
  },

  /* ───────────── Héro ───────────── */
  hero: {
    badge: "Électronique · Automatisme · Énergie — Algérie",
    title: "Votre équipement est en panne ?",
    titleAccent: "Je le remets en marche.",
    subtitle:
      "Réparation et programmation d'équipements industriels en Algérie : variateurs de vitesse (VFD), automates (PLC), cartes électroniques, armoires de commande, groupes électrogènes et machines. Sur site et en atelier.",
    ctaPrimary: "Discuter sur WhatsApp",
    ctaQuote: "Demander un devis",
    chips: [
      "Sur site — partout en Algérie",
      "Atelier équipé",
      "Diagnostic 24–48h",
      "Devis rapide & gratuit",
    ],
  },

  /* ───────────── Services (source de vérité) ───────────── */
  services: {
    eyebrow: "Services",
    title: "Ce que je prends en charge",
    intro:
      "De la programmation d'automates à l'installation de groupes électrogènes, en passant par la réparation au niveau composant — un seul interlocuteur pour remettre votre production en marche.",
    learnMore: "En savoir plus",
    allServices: "Tous les services",
    coversTitle: "Ce que je prends en charge",
    relatedTitle: "Autres services",
    ctaTitle: "Un équipement à réparer ou à programmer ?",
    ctaSubtitle:
      "Envoyez-moi une description ou une photo sur WhatsApp — je vous réponds rapidement avec un diagnostic et un devis.",
    indexTitle: "Services — Réparation & Automatisme Industriel",
    indexIntro:
      "Réparation, programmation et installation d'équipements industriels partout en Algérie.",
    indexMetaTitle: "Services | Réparation & Automatisme Industriel – MTE Algérie",
    indexMetaDescription:
      "Tous les services MTE : réparation VFD, programmation PLC, cartes électroniques, armoires de commande, groupes électrogènes et dépannage de machines industrielles en Algérie.",
    groups: {
      automation: "Automatisme & Programmation",
      repair: "Réparation industrielle",
      power: "Groupes électrogènes",
    },
    items: [
      {
        slug: "programmation-plc",
        group: "automation",
        title: "Automates (PLC) — programmation & réparation",
        tagline: "Développement, modification et dépannage de vos automates.",
        intro:
          "Programmation et réparation d'automates programmables industriels pour des machines fiables et performantes.",
        overview:
          "Je développe, modifie et répare les programmes d'automates (PLC) toutes marques. Que ce soit une nouvelle machine, une modernisation ou un dépannage urgent, j'interviens à la source pour remettre votre process en marche.",
        covers: [
          "Siemens S7-1200 / S7-1500 (TIA Portal), S7-300/400, LOGO!",
          "Schneider Modicon / EcoStruxure, Omron, Fatek, Delta",
          "Développement de programmes neufs",
          "Modification & migration d'installations existantes",
          "Mise en réseau et communication industrielle",
          "Sauvegarde et documentation de vos programmes",
        ],
      },
      {
        slug: "variateurs-vfd",
        group: "automation",
        title: "Variateurs de vitesse (VFD)",
        tagline: "Réparation, paramétrage et mise en service.",
        intro:
          "Réparation et mise en service de variateurs de fréquence (VFD) toutes marques et toutes puissances.",
        overview:
          "Je répare au niveau composant et je mets en service les variateurs de vitesse : étages de puissance, cartes de commande, paramétrage moteur et optimisation. De 0,37 kW à plusieurs centaines de kW.",
        covers: [
          "ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT",
          "Réparation étage de puissance (IGBT) et cartes de commande",
          "Paramétrage et mise en service sur site",
          "Diagnostic de défauts et optimisation moteur",
          "Remplacement et conseil au dimensionnement",
        ],
      },
      {
        slug: "servo-variateurs",
        group: "automation",
        title: "Servo-variateurs & contrôle d'axes",
        tagline: "Programmation, réglage et synchronisation.",
        intro:
          "Configuration et réglage de servo-variateurs pour un positionnement précis et un contrôle de mouvement fiable.",
        overview:
          "Je configure, règle et dépanne les systèmes servo : réglage de boucle, positionnement, synchronisation d'axes et came électronique pour vos machines de précision.",
        covers: [
          "Mise en service de servo-variateurs toutes marques",
          "Réglage de boucle et optimisation des performances",
          "Positionnement et contrôle de mouvement",
          "Synchronisation d'axes & came électronique",
          "Diagnostic et dépannage",
        ],
      },
      {
        slug: "ihm-scada",
        group: "automation",
        title: "IHM / SCADA",
        tagline: "Développement et réparation d'interfaces opérateur.",
        intro:
          "Conception d'interfaces homme-machine (IHM) et de supervision SCADA claires et efficaces.",
        overview:
          "Je développe et répare vos écrans tactiles IHM et systèmes de supervision : pages de contrôle, alarmes, recettes et suivi de production, pour piloter vos machines simplement.",
        covers: [
          "Développement d'écrans tactiles (HMI)",
          "Supervision SCADA & suivi de production",
          "Gestion des alarmes et des recettes",
          "Réparation et remplacement de panneaux IHM",
          "Communication avec automates et variateurs",
        ],
      },
      {
        slug: "reparation-carte-electronique",
        group: "repair",
        title: "Réparation de cartes électroniques (PCB)",
        tagline: "Réparation au niveau composant, toutes cartes industrielles.",
        intro:
          "Réparation de cartes électroniques industrielles au niveau composant, avec rétro-ingénierie si nécessaire.",
        overview:
          "Je répare vos cartes électroniques industrielles : cartes de puissance, cartes de commande, alimentations et modules. Diagnostic, remplacement de composants CMS et tests en charge.",
        covers: [
          "Diagnostic au niveau composant",
          "Remplacement de composants CMS / traversants",
          "Rétro-ingénierie de cartes sans schéma",
          "Cartes de puissance, de commande et alimentations",
          "Tests en charge et validation",
        ],
      },
      {
        slug: "armoires-de-commande",
        group: "repair",
        title: "Armoires & panneaux de commande",
        tagline: "Conception, montage et réparation.",
        intro:
          "Conception, montage et réparation d'armoires et de panneaux de commande sur mesure.",
        overview:
          "Je conçois, câble et répare vos armoires électriques et panneaux de commande, selon votre cahier des charges et les règles de l'art, pour une installation sûre et durable.",
        covers: [
          "Conception et câblage d'armoires sur mesure",
          "Réparation et mise à niveau d'armoires existantes",
          "Intégration automates, variateurs et protections",
          "Schémas électriques et documentation",
          "Mise en conformité et sécurité",
        ],
      },
      {
        slug: "reparation-machine-industrielle",
        group: "repair",
        title: "Réparation de machines industrielles",
        tagline: "Dépannage électrique & électronique, toutes marques.",
        intro:
          "Dépannage de machines industrielles — partie électrique, électronique et automatisme, toutes marques.",
        overview:
          "Quand une machine s'arrête, j'interviens pour trouver et corriger la panne : partie commande, puissance, capteurs et actionneurs. Objectif : relancer votre production au plus vite.",
        covers: [
          "Diagnostic de pannes électriques et électroniques",
          "Dépannage partie commande et puissance",
          "Capteurs, actionneurs et sécurités",
          "Remise en service et essais",
          "Conseil pour fiabiliser la machine",
        ],
      },
      {
        slug: "groupe-electrogene",
        group: "power",
        title: "Groupes électrogènes",
        tagline: "Installation, réparation & maintenance.",
        intro:
          "Installation, réparation et maintenance de groupes électrogènes, avec armoire d'inversion automatique (ATS).",
        overview:
          "J'installe, répare et entretiens vos groupes électrogènes : raccordement, armoire d'inversion de source (ATS/normal-secours), automatismes de démarrage et maintenance pour une alimentation de secours fiable.",
        covers: [
          "Installation et raccordement de groupes électrogènes",
          "Armoire d'inversion automatique (ATS) normal/secours",
          "Automatisme de démarrage et de transfert",
          "Réparation et maintenance préventive",
          "Diagnostic de pannes et dépannage",
        ],
      },
    ],
  },

  /* ───────────── Réalisations récentes (Supabase) ───────────── */
  projects: {
    eyebrow: "Réalisations",
    title: "Des interventions réelles",
    intro:
      "Un aperçu de mes dernières interventions sur le terrain, partout en Algérie.",
    viewAll: "Voir toutes mes réalisations",
    empty: "Mes réalisations seront bientôt affichées ici.",
  },

  /* ───────────── Pourquoi moi ───────────── */
  why: {
    eyebrow: "Pourquoi MTE",
    title: "Une panne traitée à la source",
    items: [
      {
        title: "Réparation au niveau composant",
        description:
          "Je ne remplace pas en aveugle : je diagnostique et répare la carte à la source, pour un coût maîtrisé.",
      },
      {
        title: "Programmation + électronique",
        description:
          "Double compétence automatisme et électronique : je traite aussi bien le logiciel que le matériel.",
      },
      {
        title: "Sur site, partout en Algérie",
        description:
          "J'interviens directement dans votre usine, et je dispose d'un atelier équipé pour les réparations.",
      },
      {
        title: "Transparent & rapide",
        description:
          "Diagnostic sous 24–48h, devis clair sans frais cachés, et un seul interlocuteur du début à la fin.",
      },
    ],
  },

  /* ───────────── Secteurs ───────────── */
  industries: {
    eyebrow: "Secteurs",
    title: "Les industries que j'accompagne",
    intro:
      "J'interviens pour tout type d'industrie et d'atelier utilisant des équipements électriques et automatisés.",
    items: [
      "Agroalimentaire",
      "Cimenteries & béton",
      "Carrières & mines",
      "Recyclage & déchets",
      "Plasturgie & textile",
      "Stations de pompage & eau",
      "Agriculture & irrigation",
      "Énergies renouvelables",
    ],
  },

  /* ───────────── Méthode ───────────── */
  process: {
    eyebrow: "Méthode",
    title: "Comment je travaille",
    intro:
      "Une démarche claire, du diagnostic à la remise en service, pour une intervention sans surprise.",
    steps: [
      { title: "Diagnostic", description: "Analyse de la panne ou du besoin, sous 24 à 48 heures." },
      { title: "Devis transparent", description: "Proposition claire et détaillée, sans frais cachés." },
      { title: "Intervention", description: "Réparation, programmation ou installation, en atelier ou sur site." },
      { title: "Tests & validation", description: "Essais en charge et vérification complète." },
      { title: "Livraison & suivi", description: "Remise en service, avec garantie et support." },
    ],
  },

  /* ───────────── Marques ───────────── */
  brands: {
    eyebrow: "Technologies",
    title: "Les marques avec lesquelles je travaille",
  },

  /* ───────────── À propos ───────────── */
  about: {
    eyebrow: "À Propos",
    title: "Fekhar Moutie — ingénieur automatisme & électronique",
    p1: "Lorsque vos machines s'arrêtent, votre production s'arrête aussi. Je suis <strong>Fekhar Moutie</strong>, ingénieur en automatisme et électronique basé à Médéa, et j'interviens partout en Algérie pour remettre vos équipements en marche.",
    p2: "Ma force : une double compétence <strong>programmation + électronique</strong>. Je programme vos automates et variateurs, je répare vos cartes au niveau composant, et j'installe vos armoires et groupes électrogènes — un seul interlocuteur, de la panne à la remise en service.",
    p3: "Mon engagement : des solutions techniques sur mesure, transparentes et fiables, pour l'efficacité maximale de vos installations.",
    ctaPortfolio: "Mes réalisations",
    cvFr: "Mon CV (Français)",
    cvEn: "Mon CV (Anglais)",
  },

  /* ───────────── FAQ ───────────── */
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Réparez-vous les variateurs de vitesse (VFD) ?",
        a: "Oui. Je répare au niveau composant les variateurs de fréquence toutes marques (ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT) — étages de puissance, cartes de commande — et j'assure aussi le paramétrage et la mise en service.",
      },
      {
        q: "Programmez-vous les automates Siemens et Schneider ?",
        a: "Oui. Je programme les automates Siemens S7-1200/1500 (TIA Portal), S7-300/400, LOGO!, ainsi que Schneider Modicon, Omron et Fatek : programmes neufs, modification et migration.",
      },
      {
        q: "Installez-vous et réparez-vous les groupes électrogènes ?",
        a: "Oui. J'installe, répare et entretiens les groupes électrogènes, y compris l'armoire d'inversion automatique (ATS) normal/secours et l'automatisme de démarrage.",
      },
      {
        q: "Réparez-vous les cartes électroniques et les armoires de commande ?",
        a: "Oui. Je répare les cartes électroniques industrielles au niveau composant (avec rétro-ingénierie si besoin), et je conçois, câble et répare les armoires et panneaux de commande.",
      },
      {
        q: "Intervenez-vous sur site partout en Algérie ?",
        a: "Oui. Je me déplace sur site partout en Algérie pour le dépannage, la mise en service et l'installation, et je dispose d'un atelier équipé pour les réparations.",
      },
      {
        q: "Quel est le délai d'intervention ?",
        a: "Le diagnostic est réalisé sous 24 à 48 heures. Le délai dépend ensuite de la complexité et de la disponibilité des pièces, avec un objectif de rapidité pour relancer votre production.",
      },
    ],
  },

  /* ───────────── Formulaire de devis (WhatsApp) ───────────── */
  quote: {
    eyebrow: "Devis gratuit",
    title: "Décrivez votre problème",
    subtitle:
      "Remplissez ce formulaire : votre demande part directement sur mon WhatsApp et je vous réponds rapidement.",
    name: "Votre nom",
    phone: "Téléphone",
    city: "Ville / Wilaya",
    equipment: "Type d'équipement",
    message: "Décrivez la panne ou le besoin",
    submit: "Envoyer sur WhatsApp",
    equipmentOptions: [
      "Variateur de vitesse (VFD)",
      "Automate (PLC)",
      "Carte électronique (PCB)",
      "Armoire / panneau de commande",
      "Groupe électrogène",
      "Machine industrielle",
      "Programmation / mise en service",
      "Autre",
    ],
    waIntro: "Bonjour, je souhaite un devis.",
  },

  /* ───────────── Contact ───────────── */
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet",
    subtitle: "Contactez-moi par WhatsApp, téléphone, ou passez à l'atelier.",
    whatsappLabel: "WhatsApp",
    whatsappDesc: "Discutez avec moi directement",
    callLabel: "Téléphone",
    callDesc: "Appelez-moi directement",
    locationLabel: "Médéa, Ain Dhab, Algérie",
    locationDesc: "Localisation de l'atelier",
  },

  /* ───────────── Témoignages (affichés si renseignés) ───────────── */
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ce que disent mes clients",
  },

  /* ───────────── Pied de page ───────────── */
  footer: {
    about:
      "Réparation, programmation et installation d'équipements industriels. Variateurs, automates, cartes électroniques, armoires et groupes électrogènes. Au service de l'industrie algérienne.",
    services: "Services",
    quickLinks: "Liens rapides",
    follow: "Suivez-moi",
    rights: "Tous droits réservés.",
    tagline: "Électronique & Automatisme Industriel",
  },

  /* ───────────── Portfolio (chrome) ───────────── */
  portfolio: {
    heroTitle: "Mes",
    heroTitleAccent: "Réalisations",
    heroSubtitle:
      "Réparations, programmation et installations à travers toute l'Algérie.",
    loading: "Chargement...",
    emptyTitle: "Aucune réalisation pour le moment",
    emptyDesc: "Revenez bientôt pour découvrir mes dernières interventions.",
    interventionDate: "Date d'intervention :",
    viewProject: "Consulter le projet",
    notFound: "Publication introuvable",
    backToPortfolio: "Retourner aux réalisations",
    mediaUnavailable: "Média non disponible",
    noMedia: "Aucun média",
    photo: "photo",
    photos: "photos",
    videoLabel: "Vidéo",
    metaTitle: "Réalisations | Réparation & Automatisme Industriel – MTE Algérie",
    metaDescription:
      "Découvrez mes interventions : réparation de variateurs et cartes électroniques, programmation d'automates, armoires et groupes électrogènes partout en Algérie.",
  },
};

export default fr;
export type Dictionary = typeof fr;
