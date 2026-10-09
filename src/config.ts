// Central business / site constants reused across UI, SEO and structured data.

export const SITE = {
  baseUrl: "https://moutie.vercel.app",
  name: "MTE",
  legalName: "MTE – Automatisme & Électronique Industrielle",
  founder: "Fekhar Moutie",
  foundingDate: "2020",
  email: "moutiefekhar@gmail.com",
  phone: "+213778461682",
  phoneDisplay: "+213 778 46 16 82",
  whatsapp: "https://wa.me/213778461682",
  maps: "https://maps.app.goo.gl/o5DLijMqhsTaiac19",
  address: {
    street: "Ain Dhab, Médéa",
    locality: "Médéa",
    region: "Médéa",
    postalCode: "26011",
    country: "DZ",
  },
  geo: { lat: "36.2675", lng: "2.7539" },
  openingHours: "Sa-Th 08:00-17:00",
  social: {
    linkedin: "https://www.linkedin.com/in/moutie/",
    facebook: "https://www.facebook.com/mogeek02",
    instagram: "https://www.instagram.com/mooutiem",
    github: "https://github.com/MOGEEK02",
  },
} as const;

export const SAME_AS = [
  SITE.whatsapp,
  SITE.social.instagram,
  SITE.social.linkedin,
  SITE.social.facebook,
  SITE.social.github,
];

/** Branded 1200×630 share image for Facebook / WhatsApp / Twitter previews. */
export const OG_IMAGE = `${SITE.baseUrl}/images/og.jpg`;
