import { createContext, useContext } from "react";

/**
 * Site languages. French lives at "/", English under "/en".
 * Every text of the public pages is here; content edited in /admin (services, projects,
 * contact details) has its own French and English fields.
 */
export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];

export const LangContext = createContext<Lang>("fr");
export const useLang = () => useContext(LangContext);
export const useT = () => DICT[useContext(LangContext)];

/** "/portfolio" → "/en/portfolio"; "/#contact" → "/en#contact". */
export function localePath(lang: Lang, path: string) {
  if (lang === "fr") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** The current page's path without the language prefix. */
export function basePath(pathname: string) {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

const fr = {
  locale: "fr-DZ",
  dateLocale: "fr-FR",
  ogLocale: "fr_DZ",
  switchTo: { label: "EN", title: "English version" },
  skip: "Aller au contenu",
  nav: {
    services: "Services",
    method: "Méthode",
    about: "À propos",
    work: "Réalisations",
    faq: "FAQ",
    quote: "Demander un devis",
    main: "Navigation principale",
    mobile: "Navigation mobile",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    home: "MTE – accueil",
  },
  seo: {
    homeTitle: "MTE – Automatisme et électronique industrielle en Algérie | PLC, armoires, variateurs",
    homeDescription:
      "Programmation PLC et IHM, dépannage d’armoires de commande, études électriques, réparation de variateurs de vitesse et de cartes électroniques. Médéa et intervention partout en Algérie.",
    workTitle: "Réalisations – automatisme et réparations industrielles | MTE Algérie",
    workDescription:
      "Interventions réelles de MTE en Algérie : programmation d’automates, rétrofit de lignes de production, mise en service et réparation de variateurs, cartes électroniques.",
    projectSuffix: "Réalisations MTE",
    notFoundTitle: "Page introuvable | MTE",
    notFoundDescription: "Cette page n’existe pas ou a été déplacée.",
  },
  hero: {
    eyebrow: "Médéa · Intervention dans toute l’Algérie",
    title: "Automatisme et électronique industrielle",
    text: "Programmation d’automates, dépannage d’armoires de commande, études électriques, réparation de variateurs et de cartes électroniques : un seul interlocuteur pour remettre vos machines en production.",
    checks: ["Diagnostic sous 24 à 48 h", "Devis avant intervention", "Toutes marques"],
  },
  brands: { label: "Marques prises en charge", text: "Équipements de toutes marques, notamment" },
  services: {
    eyebrow: "Services",
    title: "Ce que nous faisons",
    text: "De la programmation d’automates à la réparation au niveau composant, en atelier ou sur site.",
  },
  reach: {
    eyebrow: "Zones et secteurs",
    title: "Au service de l’industrie algérienne",
    text: "Basés à Médéa, nous intervenons sur site dans toute l’Algérie et prenons en charge en atelier les équipements envoyés de toutes les wilayas.",
    sectorsTitle: "Secteurs où nous intervenons",
    sectors: [
      "Agroalimentaire et embouteillage",
      "Plasturgie et injection",
      "Emballage et cartonnerie",
      "Transport ferroviaire",
      "Énergie : groupes électrogènes, stabilisateurs",
      "Métallurgie : presses et découpe",
      "Pompage, ventilation et vide industriel",
    ],
    areasTitle: "Wilayas desservies, notamment",
    areas: [
      "Médéa",
      "Alger",
      "Blida",
      "Boumerdès",
      "Tipaza",
      "Bouira",
      "Aïn Defla",
      "Djelfa",
      "M’Sila",
      "Tizi Ouzou",
      "Béjaïa",
      "Sétif",
      "Bordj Bou Arréridj",
      "Chlef",
      "Tiaret",
      "Oran",
      "Constantine",
      "Annaba",
    ],
    everywhere: "… et partout ailleurs en Algérie sur demande.",
  },
  method: {
    eyebrow: "Méthode",
    title: "Une intervention claire, de la panne à la remise en service",
    text: "Vous savez à chaque étape ce qui a été constaté, ce qui sera fait et dans quel délai.",
    steps: [
      { title: "Échange", text: "Vous décrivez la machine et le besoin : photos, code défaut, programme existant. Un premier avis rapide, souvent dès l’appel." },
      { title: "Diagnostic ou étude", text: "Recherche de la panne sur site, ou étude du besoin pour un nouveau programme ou une modification." },
      { title: "Proposition", text: "Un devis clair avant d’intervenir : travaux, délai et matériel éventuel." },
      { title: "Intervention et mise en service", text: "Programmation, dépannage ou installation, essais avec vos équipes, puis sauvegarde du programme." },
    ],
  },
  about: {
    eyebrow: "À propos",
    title: "Un ingénieur, de l’automate jusqu’au composant",
    photoAlt: "Fekhar Moutie sur un site industriel en Algérie",
    since: "Depuis 2020",
    sinceText: "au service de l’industrie",
    p1a: "MTE a été créé par ",
    p1b: ", ingénieur en automatisme et électronique, pour accompagner les industriels sur toute la partie commande de leurs machines : automates, écrans, armoires, variateurs et cartes électroniques.",
    p2: "Être à la fois programmeur et électronicien permet de dépanner vite : lire le programme en ligne, mesurer les signaux dans l’armoire et, si besoin, comprendre ce qui se passe sur une carte.",
    p3: "Notre engagement : des interventions préparées, des explications claires, et des programmes sauvegardés et documentés.",
    work: "Voir les réalisations",
    cvFr: "CV (français)",
    cvEn: "CV (anglais)",
  },
  latest: { eyebrow: "Réalisations", title: "Interventions récentes", all: "Toutes les réalisations" },
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    text: "Une autre question ? Appelez-nous ou écrivez-nous sur WhatsApp.",
    items: [
      {
        q: "Quels automates programmez-vous ?",
        a: "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider Electric (Modicon, Zelio), Mitsubishi, Omron et Fatek, ainsi que les écrans IHM associés. Pour une autre marque, contactez-nous : nous vous disons rapidement si nous pouvons intervenir.",
      },
      {
        q: "Le programme de ma machine est perdu, que faire ?",
        a: "Nous récupérons le programme de l’automate quand c’est possible, ou le réécrivons à partir du fonctionnement de la machine. Vous recevez ensuite une sauvegarde pour ne plus dépendre d’une seule copie.",
      },
      {
        q: "Réparez-vous les variateurs de vitesse ?",
        a: "Oui : diagnostic, réparation au niveau composant et paramétrage de variateurs ABB, Schneider Altivar, Siemens, Danfoss, LS et autres, de 0,37 kW à plus de 500 kW. Le diagnostic est réalisé sous 24 à 48 heures.",
      },
      {
        q: "Réalisez-vous des études électriques ?",
        a: "Oui : schémas électriques, bilan de puissance, choix des protections et des câbles, conception d’armoires et rétrofit d’installations. Envoyez-nous votre cahier des charges ou une description de l’installation.",
      },
      {
        q: "Intervenez-vous sur site ?",
        a: "Oui, partout en Algérie, depuis Médéa. Pour une machine à l’arrêt, envoyez-nous des photos de l’armoire et le code défaut affiché : cela permet souvent de préparer l’intervention avant de se déplacer.",
      },
      {
        q: "Comment obtenir un devis ?",
        a: "Décrivez votre besoin via le formulaire de contact ou WhatsApp. Vous recevez un devis avant toute intervention.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Une machine à l’arrêt ou un projet ?",
    text: "Envoyez une photo de l’armoire, le code défaut affiché ou la description de votre projet : nous revenons vers vous rapidement.",
    whatsapp: "WhatsApp",
    phone: "Téléphone",
    email: "E-mail",
    address: "Adresse",
    hours: "Horaires",
  },
  form: {
    title: "Demander un devis",
    intro: "Décrivez la panne ou le projet, nous vous répondons rapidement avec des questions ou une proposition.",
    name: "Nom *",
    company: "Entreprise",
    phone: "Téléphone",
    email: "E-mail",
    needContact: "Indiquez au moins un téléphone ou un e-mail pour que nous puissions vous répondre.",
    type: "Type de besoin",
    types: ["Programmation PLC / IHM", "Machine ou armoire en panne", "Étude électrique", "Réparation de variateur", "Réparation de carte électronique", "Autre"],
    model: "Automate / matériel",
    modelPlaceholder: "ex. Siemens S7-1200, Schneider M221",
    message: "Description *",
    messagePlaceholder: "Machine concernée, symptômes ou code défaut, ou description du projet…",
    onSite: "Intervention sur site souhaitée",
    send: "Envoyer la demande",
    sending: "Envoi…",
    whatsapp: "Envoyer via WhatsApp",
    error: "L’envoi n’a pas abouti. Réessayez dans un instant, ou envoyez la même demande par WhatsApp.",
    sentTitle: "Demande envoyée",
    sentText: (name: string, byPhone: boolean) =>
      `Merci ${name}. Nous avons bien reçu votre demande et revenons vers vous rapidement ${byPhone ? "par téléphone" : "par e-mail"}.`,
    another: "Envoyer une autre demande",
    honeypot: "Site web",
    waIntro: "Bonjour MTE, je souhaite un devis.",
    waLabels: { name: "Nom", company: "Entreprise", phone: "Téléphone", email: "E-mail", type: "Besoin", model: "Matériel", onSite: "Intervention sur site souhaitée" },
  },
  footer: {
    text: "Automatisme et électronique industrielle : programmation PLC, dépannage d’armoires, études électriques et réparation, à Médéa et partout en Algérie.",
    services: "Services",
    navigation: "Navigation",
    contact: "Contact",
    faq: "Questions fréquentes",
    rights: "Tous droits réservés.",
    place: "Médéa, Algérie",
  },
  work: {
    eyebrow: "Réalisations",
    title: "Nos interventions sur le terrain",
    text: "Automates, variateurs, cartes de puissance, machines de production : quelques interventions réalisées pour nos clients en Algérie.",
    loading: "Chargement",
    empty: "Les réalisations seront bientôt publiées.",
    video: "Vidéo",
    media: (n: number) => `${n} médias`,
    open: "Voir le projet",
  },
  post: {
    back: "Toutes les réalisations",
    prev: "Média précédent",
    next: "Média suivant",
    show: (n: number) => `Afficher le média ${n}`,
    ctaTitle: "Un besoin similaire ?",
    ctaText: "Décrivez-nous votre machine ou votre projet : nous vous répondons avec un diagnostic et un devis.",
    originalLanguage: "",
  },
  notFound: {
    eyebrow: "Erreur 404",
    title: "Page introuvable",
    text: "Cette page n’existe pas ou a été déplacée.",
    home: "Retour à l’accueil",
    work: "Voir les réalisations",
  },
};

export type Dict = typeof fr;

const en: Dict = {
  locale: "en",
  dateLocale: "en-GB",
  ogLocale: "en_US",
  switchTo: { label: "FR", title: "Version française" },
  skip: "Skip to content",
  nav: {
    services: "Services",
    method: "Process",
    about: "About",
    work: "Projects",
    faq: "FAQ",
    quote: "Request a quote",
    main: "Main navigation",
    mobile: "Mobile navigation",
    open: "Open menu",
    close: "Close menu",
    home: "MTE – home",
  },
  seo: {
    homeTitle: "MTE – Industrial automation & electronics in Algeria | PLC, control panels, VFD",
    homeDescription:
      "PLC and HMI programming, control panel troubleshooting, electrical design studies, VFD drive and circuit board repair. Based in Médéa, on-site service across Algeria.",
    workTitle: "Projects – industrial automation and repair work | MTE Algeria",
    workDescription:
      "Real projects by MTE in Algeria: PLC programming, production line retrofits, VFD commissioning and repair, electronic board repair.",
    projectSuffix: "MTE Projects",
    notFoundTitle: "Page not found | MTE",
    notFoundDescription: "This page does not exist or has moved.",
  },
  hero: {
    eyebrow: "Médéa · On-site service across Algeria",
    title: "Industrial automation and electronics",
    text: "PLC programming, control panel troubleshooting, electrical design studies, VFD drive and circuit board repair: one partner to get your machines back into production.",
    checks: ["Diagnosis within 24–48 h", "Quote before any work", "All brands"],
  },
  brands: { label: "Brands we work on", text: "Equipment of all brands, including" },
  services: {
    eyebrow: "Services",
    title: "What we do",
    text: "From PLC programming to component-level repair, in our workshop or on site.",
  },
  reach: {
    eyebrow: "Areas and industries",
    title: "Serving Algerian industry",
    text: "Based in Médéa, we work on site across Algeria and repair equipment sent to our workshop from every wilaya.",
    sectorsTitle: "Industries we work for",
    sectors: [
      "Food processing and bottling",
      "Plastics and injection moulding",
      "Packaging and cardboard",
      "Rail transport",
      "Energy: generators, voltage stabilisers",
      "Metalworking: presses and cutting",
      "Pumping, ventilation and industrial vacuum",
    ],
    areasTitle: "Wilayas served, including",
    areas: fr.reach.areas,
    everywhere: "… and anywhere else in Algeria on request.",
  },
  method: {
    eyebrow: "Process",
    title: "A clear process, from breakdown to restart",
    text: "At every step you know what was found, what will be done and how long it will take.",
    steps: [
      { title: "First contact", text: "You describe the machine and the need: photos, fault code, existing program. A first opinion, often during the call." },
      { title: "Diagnosis or study", text: "On-site fault finding, or analysis of the need for a new program or a modification." },
      { title: "Proposal", text: "A clear quote before any work: tasks, lead time and any parts needed." },
      { title: "Work and commissioning", text: "Programming, troubleshooting or installation, tests with your team, then a backup of the program." },
    ],
  },
  about: {
    eyebrow: "About",
    title: "An engineer, from the PLC down to the component",
    photoAlt: "Fekhar Moutie on an industrial site in Algeria",
    since: "Since 2020",
    sinceText: "serving industry",
    p1a: "MTE was founded by ",
    p1b: ", an automation and electronics engineer, to support manufacturers on the whole control side of their machines: PLCs, HMIs, control panels, drives and electronic boards.",
    p2: "Being both a programmer and an electronics technician makes troubleshooting fast: reading the program online, measuring signals in the panel and, when needed, understanding what is happening on a board.",
    p3: "Our commitment: well-prepared interventions, clear explanations, and programs that are backed up and documented.",
    work: "See our projects",
    cvFr: "CV (French)",
    cvEn: "CV (English)",
  },
  latest: { eyebrow: "Projects", title: "Recent work", all: "All projects" },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    text: "Another question? Call us or message us on WhatsApp.",
    items: [
      {
        q: "Which PLCs do you program?",
        a: "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider Electric (Modicon, Zelio), Mitsubishi, Omron and Fatek, as well as their HMIs. For another brand, contact us: we will quickly tell you whether we can help.",
      },
      {
        q: "My machine’s program is lost. What can be done?",
        a: "We recover the program from the PLC when possible, or rewrite it from the way the machine works. You then receive a backup so you no longer depend on a single copy.",
      },
      {
        q: "Do you repair variable frequency drives (VFD)?",
        a: "Yes: diagnosis, component-level repair and parameter setup of ABB, Schneider Altivar, Siemens, Danfoss, LS and other drives, from 0.37 kW to over 500 kW. Diagnosis is done within 24 to 48 hours.",
      },
      {
        q: "Do you carry out electrical design studies?",
        a: "Yes: wiring diagrams, power balance, selection of protection devices and cables, control panel design and retrofit of existing installations. Send us your specifications or a description of the installation.",
      },
      {
        q: "Do you work on site?",
        a: "Yes, anywhere in Algeria, from Médéa. For a machine that is down, send us photos of the panel and the fault code shown: this often lets us prepare the intervention before travelling.",
      },
      {
        q: "How do I get a quote?",
        a: "Describe your need through the contact form or WhatsApp. You receive a quote before any work.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Machine down or a new project?",
    text: "Send a photo of the panel, the fault code shown or a description of your project: we will get back to you quickly.",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email",
    address: "Address",
    hours: "Opening hours",
  },
  form: {
    title: "Request a quote",
    intro: "Describe the fault or the project, and we will reply quickly with questions or a proposal.",
    name: "Name *",
    company: "Company",
    phone: "Phone",
    email: "Email",
    needContact: "Please give at least a phone number or an email so we can reply.",
    type: "Type of need",
    types: ["PLC / HMI programming", "Machine or panel down", "Electrical design study", "VFD drive repair", "Electronic board repair", "Other"],
    model: "PLC / equipment",
    modelPlaceholder: "e.g. Siemens S7-1200, Schneider M221",
    message: "Description *",
    messagePlaceholder: "Machine concerned, symptoms or fault code, or project description…",
    onSite: "On-site intervention needed",
    send: "Send request",
    sending: "Sending…",
    whatsapp: "Send via WhatsApp",
    error: "Sending failed. Please try again in a moment, or send the same request via WhatsApp.",
    sentTitle: "Request sent",
    sentText: (name: string, byPhone: boolean) =>
      `Thank you ${name}. We have received your request and will get back to you quickly ${byPhone ? "by phone" : "by email"}.`,
    another: "Send another request",
    honeypot: "Website",
    waIntro: "Hello MTE, I would like a quote.",
    waLabels: { name: "Name", company: "Company", phone: "Phone", email: "Email", type: "Need", model: "Equipment", onSite: "On-site intervention needed" },
  },
  footer: {
    text: "Industrial automation and electronics: PLC programming, control panel troubleshooting, electrical design and repair, in Médéa and across Algeria.",
    services: "Services",
    navigation: "Navigation",
    contact: "Contact",
    faq: "Frequently asked questions",
    rights: "All rights reserved.",
    place: "Médéa, Algeria",
  },
  work: {
    eyebrow: "Projects",
    title: "Our work in the field",
    text: "PLCs, drives, power boards, production machines: a selection of interventions for our clients in Algeria.",
    loading: "Loading",
    empty: "Projects will be published soon.",
    video: "Video",
    media: (n: number) => `${n} media`,
    open: "View project",
  },
  post: {
    back: "All projects",
    prev: "Previous media",
    next: "Next media",
    show: (n: number) => `Show media ${n}`,
    ctaTitle: "A similar need?",
    ctaText: "Tell us about your machine or project: we will reply with a diagnosis and a quote.",
    originalLanguage: "This project description is only available in French.",
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Page not found",
    text: "This page does not exist or has moved.",
    home: "Back to home",
    work: "See our projects",
  },
};

export const DICT: Record<Lang, Dict> = { fr, en };
