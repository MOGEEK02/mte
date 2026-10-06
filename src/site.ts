/**
 * Business facts used across the site and in the structured data for search engines.
 * Contact details are edited in /admin → Paramètres (see src/contact.ts); CONTACT is the
 * built-in copy. Page texts are in src/i18n.ts.
 */
export const SITE_URL = "https://moutie.vercel.app";

export const BUSINESS = {
  name: "MTE Industrial Electronics",
  founder: "Fekhar Moutie",
  foundingDate: "2020",
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/web/og-default.png`,
  street: "Ain Dhab",
  city: "Médéa",
  postalCode: "26011",
  region: "Médéa",
  country: "DZ",
  geo: { latitude: 36.2675, longitude: 2.7539 },
  opens: "08:00",
  closes: "17:00",
  days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
};

export const CONTACT = {
  phoneDisplay: "+213 778 46 16 82",
  email: "moutiefekhar@gmail.com",
  address: "Ain Dhab, Médéa 26011, Algérie",
  mapUrl: "https://maps.app.goo.gl/o5DLijMqhsTaiac19",
  hours: "Samedi – jeudi, 8 h – 17 h",
  hoursEn: "Saturday – Thursday, 8 am – 5 pm",
  hoursAr: "من السبت إلى الخميس، 8:00 – 17:00",
};

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/moutie/",
  facebook: "https://www.facebook.com/mogeek02",
  instagram: "https://www.instagram.com/mooutiem",
  github: "https://github.com/MOGEEK02",
};

export const BRANDS = [
  { name: "Siemens", logo: "/images/web/marque-siemens.webp" },
  { name: "Schneider Electric", logo: "/images/web/marque-schneider.webp" },
  { name: "Omron", logo: "/images/web/marque-omron.webp" },
  { name: "ABB", logo: "/images/web/marque-abb.webp" },
  { name: "Fatek", logo: "/images/web/marque-fatek.webp" },
] as const;

/** Topics for search engines and AI assistants (structured data "knowsAbout"). */
export const EXPERTISE = [
  "PLC programming",
  "HMI programming",
  "Siemens S7 / TIA Portal",
  "Schneider Modicon",
  "Mitsubishi FX",
  "Omron",
  "Fatek",
  "Control panel troubleshooting",
  "Electrical design",
  "Variable frequency drive (VFD) repair",
  "VFD commissioning",
  "Soft starters",
  "Electronic board repair",
  "PCB reverse engineering",
  "Industrial power supplies",
  "Voltage stabilisers",
  "Industrial sensors",
];
