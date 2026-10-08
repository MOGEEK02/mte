/** Names shown in /admin → Tableau de bord for the codes saved by /api/track. */

const SOURCES: [RegExp, string][] = [
  [/^google\./, "Google"],
  [/^bing\.com$/, "Bing"],
  [/^(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/^instagram\.com$/, "Instagram"],
  [/^linkedin\.com|^lnkd\.in$/, "LinkedIn"],
  [/^(youtube\.com|youtu\.be)$/, "YouTube"],
  [/^tiktok\.com$/, "TikTok"],
  [/^(t\.co|x\.com|twitter\.com)$/, "X (Twitter)"],
  [/^(chatgpt\.com|chat\.openai\.com)$/, "ChatGPT"],
  [/^perplexity\.ai$/, "Perplexity"],
  [/^duckduckgo\.com$/, "DuckDuckGo"],
  [/^yandex\./, "Yandex"],
];
export const sourceName = (host: string) => (host ? (SOURCES.find(([re]) => re.test(host))?.[1] ?? host) : "Accès direct / applications");
export const DEVICES: Record<string, string> = { mobile: "Téléphone", desktop: "Ordinateur", tablet: "Tablette" };
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" });
  } catch {
    return null;
  }
})();
export const countryName = (code: string) => (code ? (regionNames?.of(code) ?? code) : "Inconnu");

/** Wilayas by their official number (ISO 3166-2:DZ, as sent by Vercel's geolocation). */
const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M’Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M’Ghair", "El Meniaa",
];

/** "DZ-09" → "Blida (09)"; another country → "Île-de-France · FR" style fallback. */
export function regionName(code: string) {
  const [country, region = ""] = code.split("-");
  if (country === "DZ" && /^\d+$/.test(region)) {
    const name = WILAYAS[Number(region) - 1];
    if (name) return `${name} (${region.padStart(2, "0")})`;
  }
  return `${region || "?"} · ${countryName(country)}`;
}
const CITY_FR: Record<string, string> = { Algiers: "Alger", Oran: "Oran", "Sidi Bel Abbes": "Sidi Bel Abbès", Bejaia: "Béjaïa", Setif: "Sétif", Medea: "Médéa" };
export const cityName = (city: string) => CITY_FR[city] ?? city;
