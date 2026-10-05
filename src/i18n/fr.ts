// French dictionary — source of truth for the Dictionary type.
// The English dictionary (en.ts) must mirror this shape.

const fr = {
  /* ───────────── SEO / <head> ───────────── */
  meta: {
    title:
      "Programmation PLC & Variateurs | Automatisme Industriel en Algérie – MTE",
    description:
      "MTE – Spécialiste en programmation d'automates (PLC), mise en service de variateurs de vitesse (VFD) et servo-variateurs, automatisme industriel en Algérie. Siemens, Schneider, ABB, Omron. Réparation VFD et cartes électroniques. Médéa, intervention partout en Algérie.",
    keywords:
      "programmation automate Algérie, programmation PLC Algérie, programmation Siemens S7 TIA Portal, mise en service variateur de vitesse, paramétrage VFD Algérie, programmation servo-variateur, automatisme industriel Algérie, ingénieur automatisme Algérie, Schneider Altivar, Siemens SINAMICS, réparation variateur Algérie, réparation carte électronique industrielle, Médéa",
    ogTitle:
      "MTE – Programmation PLC, Variateurs & Automatisme Industriel en Algérie",
    ogDescription:
      "Programmation d'automates et variateurs, mise en service et réparation d'équipements industriels en Algérie. Service professionnel, rapide et fiable.",
  },

  /* ───────────── Navigation ───────────── */
  nav: {
    home: "Accueil",
    about: "À Propos",
    services: "Services",
    process: "Méthode",
    faq: "FAQ",
    contact: "Contact",
    portfolio: "Réalisations",
  },

  /* ───────────── Héro ───────────── */
  hero: {
    badge: "Automatisme & Électronique Industrielle · Algérie",
    title: "Programmation & Automatisme",
    titleAccent: "Industriel",
    subtitle:
      "Programmation d'automates (PLC), mise en service de variateurs de vitesse et de servo-variateurs, développement IHM — et réparation d'équipements industriels. Au service de l'industrie algérienne.",
    ctaPrimary: "Discuter sur WhatsApp",
    ctaSecondary: "Voir mes réalisations",
    stat1Value: "Depuis 2020",
    stat1: "Expertise en automatisme",
    stat2Value: "24–48h",
    stat2: "Diagnostic",
    stat3Value: "Partout en Algérie",
    stat3: "Intervention sur site",
  },

  /* ───────────── À propos ───────────── */
  about: {
    eyebrow: "À Propos",
    title: "Qui suis-je et ce que je fais",
    p1: "Lorsque vos machines s'arrêtent, votre production s'arrête aussi. Je suis <strong>Fekhar Moutie</strong>, ingénieur en automatisme et électronique en Algérie. Ma spécialité : programmer, mettre en service et dépanner vos systèmes automatisés pour relancer votre production rapidement.",
    p2: "Je maîtrise à la fois la programmation d'automates (PLC), le paramétrage des variateurs de vitesse et servo-variateurs, le développement d'interfaces IHM/SCADA — et, en tant que technicien indépendant, la réparation au niveau composant (PCB). Cette double compétence programmation + électronique me permet de traiter la panne à la source, pas seulement d'en masquer les symptômes.",
    p3: "Mon engagement : des solutions techniques sur mesure, transparentes et fiables, pour garantir l'efficacité maximale de vos installations.",
    ctaPortfolio: "Mes réalisations",
    cvFr: "Mon CV (Français)",
    cvEn: "Mon CV (Anglais)",
  },

  /* ───────────── Marques ───────────── */
  brands: {
    eyebrow: "Technologies",
    title: "Les marques avec lesquelles je travaille",
  },

  /* ───────────── Services ───────────── */
  services: {
    eyebrow: "Services",
    title: "Ce que je fais",
    intro:
      "Mon cœur de métier : la programmation et l'automatisme industriel. Je prends aussi en charge la réparation de vos équipements électroniques.",
    group1Title: "Programmation & Mise en service",
    group1Subtitle: "Mon expertise principale",
    group2Title: "Réparation & Maintenance",
    group2Subtitle: "Dépannage au niveau composant",
    group1: [
      {
        title: "Programmation d'automates (PLC)",
        description:
          "Développement, modification et migration de programmes PLC : Siemens S7-1200/1500 (TIA Portal), S7-300/400, LOGO!, Schneider Modicon, Omron, Fatek, Delta.",
      },
      {
        title: "Mise en service de variateurs (VFD)",
        description:
          "Paramétrage, mise en service et optimisation de variateurs de fréquence : ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT.",
      },
      {
        title: "Programmation & réglage de servo-variateurs",
        description:
          "Configuration, réglage de boucle et synchronisation d'axes servo : positionnement précis, came électronique et contrôle de mouvement.",
      },
      {
        title: "Développement IHM / SCADA",
        description:
          "Conception d'interfaces opérateur et de supervision : écrans tactiles HMI, pages de contrôle, alarmes et suivi de production.",
      },
      {
        title: "Automatisation & rétrofit",
        description:
          "Modernisation de machines, conception d'armoires de commande et intégration de capteurs et actionneurs pour automatiser vos process.",
      },
    ],
    group2: [
      {
        title: "Réparation de variateurs (VFD)",
        description:
          "Réparation au niveau composant des variateurs de vitesse : étages de puissance IGBT, cartes de commande, défauts d'alimentation.",
      },
      {
        title: "Réparation électronique (PCB / CMS)",
        description:
          "Réparation de cartes électroniques industrielles, rétro-ingénierie et remplacement de composants CMS.",
      },
      {
        title: "Panneaux HMI",
        description:
          "Réparation, remplacement et reconfiguration d'interfaces homme-machine et panneaux opérateur.",
      },
      {
        title: "Alimentations industrielles",
        description:
          "Réparation et remplacement d'alimentations industrielles (AC/DC, onduleurs, stabilisateurs).",
      },
      {
        title: "Capteurs & transducteurs",
        description:
          "Diagnostic, réparation et remplacement de capteurs : température, pression, débit et position.",
      },
    ],
  },

  /* ───────────── Méthode ───────────── */
  process: {
    eyebrow: "Méthode",
    title: "Comment je travaille",
    intro:
      "Une démarche claire, du diagnostic à la remise en service, pour une intervention sans surprise.",
    steps: [
      {
        title: "Diagnostic",
        description:
          "Analyse de la panne ou du besoin. Diagnostic réalisé sous 24 à 48 heures.",
      },
      {
        title: "Devis transparent",
        description:
          "Proposition claire et détaillée, sans frais cachés, avant toute intervention.",
      },
      {
        title: "Programmation / Réparation",
        description:
          "Intervention en atelier ou sur site : programmation, paramétrage ou réparation.",
      },
      {
        title: "Tests & validation",
        description:
          "Essais en charge et vérification complète pour garantir un fonctionnement fiable.",
      },
      {
        title: "Livraison & suivi",
        description:
          "Remise en service de votre équipement, avec garantie et support après intervention.",
      },
    ],
  },

  /* ───────────── FAQ ───────────── */
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Programmez-vous les automates Siemens et Schneider ?",
        a: "Oui. Je programme les automates Siemens S7-1200/1500 (TIA Portal), S7-300/400, LOGO!, ainsi que Schneider Modicon, Omron et Fatek : développement de programmes neufs, modification et migration d'installations existantes.",
      },
      {
        q: "Faites-vous la mise en service de variateurs de vitesse ?",
        a: "Oui. J'assure le paramétrage et la mise en service de variateurs de fréquence (VFD) ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta et INVT, en atelier ou sur site partout en Algérie.",
      },
      {
        q: "Programmez-vous les servo-variateurs ?",
        a: "Oui. Je configure et règle les servo-variateurs : réglage de boucle, positionnement, synchronisation d'axes et contrôle de mouvement.",
      },
      {
        q: "Où êtes-vous situé et intervenez-vous partout ?",
        a: "Je suis basé à Ain Dhab, Médéa (wilaya 26). J'interviens sur site partout en Algérie, et je dispose d'un atelier pour les réparations d'équipements.",
      },
      {
        q: "Réparez-vous encore les variateurs et les cartes électroniques ?",
        a: "Oui. En plus de la programmation, je répare au niveau composant les variateurs de vitesse, les cartes de puissance et de commande, les panneaux HMI et les alimentations industrielles.",
      },
      {
        q: "Quel est le délai d'intervention ?",
        a: "Le diagnostic est réalisé sous 24 à 48 heures. Le délai d'intervention dépend ensuite de la complexité et de la disponibilité des pièces, avec un objectif de rapidité pour relancer votre production.",
      },
    ],
  },

  /* ───────────── Contact ───────────── */
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet",
    subtitle:
      "Contactez-moi facilement par WhatsApp, téléphone, ou passez à l'atelier.",
    whatsappLabel: "WhatsApp",
    whatsappDesc: "Discutez avec moi directement",
    callLabel: "Téléphone",
    callDesc: "Appelez-moi directement",
    locationLabel: "Médéa, Ain Dhab, Algérie",
    locationDesc: "Localisation de l'atelier",
  },

  /* ───────────── Pied de page ───────────── */
  footer: {
    about:
      "Programmation d'automates et variateurs, automatisme industriel et réparation électronique. Au service de l'industrie algérienne.",
    quickLinks: "Liens rapides",
    follow: "Suivez-moi",
    rights: "Tous droits réservés.",
    tagline: "Automatisme & Électronique Industrielle",
  },

  /* ───────────── Portfolio (chrome) ───────────── */
  portfolio: {
    heroTitle: "Mes",
    heroTitleAccent: "Réalisations",
    heroSubtitle:
      "Programmation, mise en service et réparations à travers toute l'Algérie.",
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
    metaTitle: "Réalisations | Programmation & Réparation Industrielle – MTE Algérie",
    metaDescription:
      "Découvrez mes interventions : programmation d'automates, mise en service de variateurs, et réparations d'équipements industriels partout en Algérie.",
  },
};

export default fr;
export type Dictionary = typeof fr;
