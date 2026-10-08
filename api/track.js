// POST /api/track — one page view or contact click (WhatsApp, phone, e-mail, quote form) from the
// public site, for the statistics in /admin → Tableau de bord (src/track.ts sends it).
// Saved in "site_events" with the secret key: the page, its language, its number in the visit, the
// site the visit came from, new or returning visitor (first page), the device, browser and system,
// and the approximate country, region (wilaya) and city from Vercel's geolocation. No cookie, no IP
// address, no visitor identifier. Robots, previews and local tests are not counted.
//
// Vercel environment variables: VITE_SUPABASE_URL and SUPABASE_SECRET_KEY (already used by /api/quote).

const TYPES = new Set(['view', 'whatsapp', 'call', 'email', 'quote']);
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|java\/|axios|node-fetch|go-http|okhttp/i;
const KEEP_DAYS = 400;
const BASE_COLUMNS = new Set(['type', 'path', 'lang', 'entry', 'referrer', 'device', 'country']);

/** "www.google.com" → "google.com"; "l.facebook.com" → "facebook.com". */
export function cleanHost(value) {
  const host = String(value || '').toLowerCase().trim().replace(/^(www|m|l|lm|mobile|web)\./, '');
  return /^[a-z0-9.-]{1,100}$/.test(host) && host.includes('.') ? host : '';
}

export function deviceOf(ua) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}

const BROWSERS = [
  [/SamsungBrowser/i, 'Samsung Internet'],
  [/OPR\/|Opera/i, 'Opera'],
  [/Edg(e|A|iOS)?\//i, 'Edge'],
  [/YaBrowser/i, 'Yandex'],
  [/FBAN|FBAV|Instagram/i, 'Facebook / Instagram'],
  [/Firefox|FxiOS/i, 'Firefox'],
  [/Chrome|CriOS/i, 'Chrome'],
  [/Safari/i, 'Safari'],
];
const SYSTEMS = [
  [/Windows/i, 'Windows'],
  [/iPhone|iPad|iPod/i, 'iOS'],
  [/Android/i, 'Android'],
  [/Mac OS X|Macintosh/i, 'macOS'],
  [/CrOS/i, 'ChromeOS'],
  [/Linux/i, 'Linux'],
];
export const browserOf = (ua) => BROWSERS.find(([re]) => re.test(ua))?.[1] ?? 'Autre';
export const systemOf = (ua) => SYSTEMS.find(([re]) => re.test(ua))?.[1] ?? 'Autre';

/** Vercel's city header is URL-encoded ("S%C3%A9tif"). */
export function cityOf(value) {
  let city = String(value || '');
  try {
    city = decodeURIComponent(city);
  } catch {
    // Keep it as sent.
  }
  return city.replace(/[^\p{L}\p{M}\s'’.-]/gu, '').trim().slice(0, 60);
}

/** The event to save, or null when it must not be counted. */
export function eventFrom(body, headers) {
  const ua = String(headers['user-agent'] || '');
  if (!ua || BOT.test(ua)) return null;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (!body || typeof body !== 'object' || !TYPES.has(body.type)) return null;
  const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '';
  if (!/^\/[\w\-./%~]*$/.test(path) || /^\/(admin|api|gestion)(\/|$)/.test(path)) return null;
  const entry = body.type === 'view' && body.entry === true;
  const country = String(headers['x-vercel-ip-country'] || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  const region = String(headers['x-vercel-ip-country-region'] || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  const page = Number.isInteger(body.page) && body.page > 0 ? Math.min(body.page, 500) : null;
  return {
    type: body.type,
    path,
    lang: /^\/(en|ar)(\/|$)/.exec(path)?.[1] ?? 'fr',
    entry,
    // First page: where the visit comes from; contacts: where their visit came from.
    referrer: entry || body.type !== 'view' ? cleanHost(body.referrer) : '',
    device: deviceOf(ua),
    country,
    region: country && region ? `${country}-${region}` : '',
    city: cityOf(headers['x-vercel-ip-city']),
    page_no: page,
    return_visit: entry ? body.returning === true : null,
    browser: browserOf(ua),
    os: systemOf(ua),
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  // Production only: preview deployments share the database.
  if (!url || !key || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production')) return res.status(204).end();

  const event = eventFrom(req.body, req.headers);
  if (!event) return res.status(204).end();
  const save = (row) =>
    fetch(`${url}/rest/v1/site_events`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(4000),
    });
  try {
    let r = await save(event);
    // Columns of supabase/visiteurs.sql not created yet: keep counting with the original ones.
    if (r.status === 400) r = await save(Object.fromEntries(Object.entries(event).filter(([k]) => BASE_COLUMNS.has(k))));
    if (!r.ok) console.error('track: save failed', r.status);
    // Now and then, drop events older than about 13 months.
    if (Math.random() < 0.01) {
      const before = new Date(Date.now() - KEEP_DAYS * 864e5).toISOString();
      await fetch(`${url}/rest/v1/site_events?created_at=lt.${before}`, { method: 'DELETE', headers: { apikey: key }, signal: AbortSignal.timeout(4000) }).catch(() => {});
    }
  } catch (err) {
    console.error('track: database unreachable', err);
  }
  return res.status(204).end();
}
