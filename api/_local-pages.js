// Paths of the local pages (service × city), for /sitemap.xml. The build (scripts/prerender.mjs)
// stops if this list differs from src/local-seo.ts → localPages().

const CITIES = ['blida', 'alger', 'medea'];
const SERVICES = [
  'programmation-automate',
  'depannage-armoire-electrique',
  'etude-electrique',
  'reparation-variateur',
  'reparation-carte-electronique',
  'reparation-alimentation-capteurs',
];

export const LOCAL_PATHS = CITIES.flatMap((city) => [`/automatisme-${city}`, ...SERVICES.map((s) => `/${s}-${city}`)]);

/** The city pages and Blida / Alger come first: they matter most. */
export const localPriority = (path) => (path.startsWith('/automatisme-') ? '0.9' : /-(blida|alger)$/.test(path) ? '0.9' : '0.8');
