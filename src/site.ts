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

export const STEPS = [
  { title: "Échange", text: "Vous décrivez la machine et le besoin : photos, code défaut, programme existant. Un premier avis rapide, souvent dès l’appel." },
  { title: "Diagnostic ou étude", text: "Recherche de la panne sur site, ou étude du besoin pour un nouveau programme ou une modification." },
  { title: "Proposition", text: "Un devis clair avant d’intervenir : travaux, délai et matériel éventuel." },
  { title: "Intervention et mise en service", text: "Programmation, dépannage ou installation, essais avec vos équipes, puis sauvegarde du programme." },
] as const;

export const BRANDS = [
  { name: "Siemens", logo: "/images/web/marque-siemens.webp" },
  { name: "Schneider Electric", logo: "/images/web/marque-schneider.webp" },
  { name: "Omron", logo: "/images/web/marque-omron.webp" },
  { name: "ABB", logo: "/images/web/marque-abb.webp" },
  { name: "Fatek", logo: "/images/web/marque-fatek.webp" },
] as const;

/** Visible on the home page; the FAQPage JSON-LD in index.html mirrors it. */
export const FAQ = [
  {
    q: "Quels automates programmez-vous ?",
    a: "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider Electric (Modicon, Zelio), Omron et Fatek, ainsi que les écrans IHM associés. Pour une autre marque, contactez-nous : nous vous disons rapidement si nous pouvons intervenir.",
  },
  {
    q: "Le programme de ma machine est perdu, que faire ?",
    a: "Nous récupérons le programme de l’automate quand c’est possible, ou le réécrivons à partir du fonctionnement de la machine. Vous recevez ensuite une sauvegarde pour ne plus dépendre d’une seule copie.",
  },
  {
    q: "Intervenez-vous sur site ?",
    a: "Oui, partout en Algérie, depuis Médéa. Pour une machine à l’arrêt, envoyez-nous des photos de l’armoire et le code défaut affiché : cela permet souvent de préparer l’intervention avant de se déplacer.",
  },
  {
    q: "Réparez-vous encore les cartes électroniques ?",
    a: "Ponctuellement, quand c’est la solution la plus rapide pour relancer une machine. Notre activité principale est l’automatisme : programmation, diagnostic d’armoires et mise en service.",
  },
  {
    q: "Comment obtenir un devis ?",
    a: "Décrivez votre besoin via le formulaire de contact ou WhatsApp. Vous recevez un devis avant toute intervention.",
  },
] as const;

/** Choices for "Type de besoin" in the quote form. */
export const REQUEST_TYPES = [
  "Programmation PLC / IHM",
  "Machine ou armoire en panne",
  "Nouvelle armoire / rétrofit",
  "Variateur / mise en service",
  "Réparation de carte",
  "Autre",
] as const;
