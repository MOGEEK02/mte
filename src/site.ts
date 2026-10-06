/** Business facts shown across the site. Keep in sync with the JSON-LD in index.html. */
export const SITE_URL = "https://moutie.vercel.app";

export const CONTACT = {
  phoneDisplay: "+213 778 46 16 82",
  phoneHref: "tel:+213778461682",
  whatsapp: "213778461682",
  email: "moutiefekhar@gmail.com",
  address: "Ain Dhab, Médéa 26011, Algérie",
  mapUrl: "https://maps.app.goo.gl/o5DLijMqhsTaiac19",
  hours: "Samedi – jeudi, 8 h – 17 h",
};

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/moutie/",
  facebook: "https://www.facebook.com/mogeek02",
  instagram: "https://www.instagram.com/mooutiem",
  github: "https://github.com/MOGEEK02",
};

export function whatsappUrl(text?: string) {
  return `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const SERVICES = [
  {
    id: "variateurs",
    title: "Variateurs de vitesse (VFD)",
    text: "Diagnostic, réparation et paramétrage de variateurs AC/DC et de contrôleurs moteur, de 0,37 kW à plus de 500 kW.",
    brands: "ABB · Schneider Altivar · Siemens · Danfoss",
    image: "/images/web/variateurs.webp",
  },
  {
    id: "automates",
    title: "Automates programmables (PLC)",
    text: "Dépannage, programmation et sauvegarde de programmes. Remise en service de lignes arrêtées.",
    brands: "Siemens S7 · Modicon · Omron · Fatek",
    image: "/images/web/automates.webp",
  },
  {
    id: "cartes",
    title: "Cartes électroniques",
    text: "Réparation au niveau composant : CMS, circuits de puissance, rétro-ingénierie quand le schéma n’existe pas.",
    brands: "Cartes de commande et de puissance",
    image: "/images/web/cartes.webp",
  },
  {
    id: "ihm",
    title: "Écrans IHM",
    text: "Réparation, configuration et remplacement de pupitres opérateur et d’écrans tactiles industriels.",
    brands: "Pupitres tactiles et terminaux",
    image: "/images/web/ihm.webp",
  },
  {
    id: "alimentations",
    title: "Alimentations et stabilisateurs",
    text: "Alimentations AC/DC, onduleurs et stabilisateurs de tension : diagnostic, réparation et essais.",
    brands: "Alimentations à découpage · onduleurs",
    image: "/images/web/alimentations.webp",
  },
  {
    id: "capteurs",
    title: "Capteurs et transmetteurs",
    text: "Diagnostic et remplacement de sondes de température, de pression et de débit.",
    brands: "Instrumentation de process",
    image: "/images/web/capteurs.webp",
  },
] as const;

export const STEPS = [
  { title: "Diagnostic", text: "Réception de l’équipement ou visite sur site. Diagnostic sous 24 à 48 heures." },
  { title: "Devis", text: "Un devis clair avant toute réparation : panne constatée, pièces et délai." },
  { title: "Réparation", text: "Intervention au niveau composant, avec des pièces d’origine ou équivalentes." },
  { title: "Essais et remise en service", text: "Tests de fonctionnement avant restitution, et remise en service sur site si besoin." },
] as const;

export const BRANDS = [
  { name: "ABB", logo: "/images/web/marque-abb.webp" },
  { name: "Schneider Electric", logo: "/images/web/marque-schneider.webp" },
  { name: "Siemens", logo: "/images/web/marque-siemens.webp" },
  { name: "Omron", logo: "/images/web/marque-omron.webp" },
  { name: "Fatek", logo: "/images/web/marque-fatek.webp" },
] as const;

/** Visible on the home page; the FAQPage JSON-LD in index.html mirrors it. */
export const FAQ = [
  {
    q: "Où se trouve MTE ?",
    a: "MTE est basé à Ain Dhab, Médéa (wilaya 26). Nous intervenons sur tout le territoire national, en atelier ou sur site.",
  },
  {
    q: "Quels variateurs de vitesse réparez-vous ?",
    a: "Tous types de variateurs de fréquence : ABB ACS, Schneider Altivar, Siemens SINAMICS, Danfoss VLT, ainsi que les marques chinoises et internationales, de 0,37 kW à plus de 500 kW.",
  },
  {
    q: "Quel est le délai de réparation ?",
    a: "Le diagnostic est réalisé sous 24 à 48 heures. La réparation dépend de la panne et de la disponibilité des pièces ; nous visons 3 à 7 jours pour la plupart des interventions.",
  },
  {
    q: "Intervenez-vous sur site ?",
    a: "Oui, nous intervenons sur site partout en Algérie pour l’installation, le paramétrage et le dépannage d’équipements industriels.",
  },
  {
    q: "Comment obtenir un devis ?",
    a: "Envoyez une description de la panne (marque, modèle, symptômes, photos si possible) via le formulaire de contact ou WhatsApp. Un devis vous est remis avant toute réparation.",
  },
] as const;

export const EQUIPMENT_TYPES = [
  "Variateur de vitesse",
  "Automate (PLC)",
  "Carte électronique",
  "Écran IHM",
  "Alimentation / stabilisateur",
  "Capteur",
  "Autre",
] as const;
