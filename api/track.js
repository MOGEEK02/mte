// POST /api/track — one page view or contact click (WhatsApp, phone, e-mail, quote form) from the
// public site, for the statistics in /admin → Tableau de bord (src/track.ts sends it).
// Saved in "site_events" with the secret key: the page, its language, the referring site (first
// page of a visit), the device type and the country from Vercel's geolocation. No cookie, no IP
// address, no visitor identifier. Robots, previews and local tests are not counted.
//
// Vercel environment variables: VITE_SUPABASE_URL and SUPABASE_SECRET_KEY (already used by /api/quote).

const TYPES = new Set(['view', 'whatsapp', 'call', 'email', 'quote']);
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|java\/|axios|node-fetch|go-http|okhttp/i;
const KEEP_DAYS = 400;

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
  return {
    type: body.type,
    path,
    lang: /^\/(en|ar)(\/|$)/.exec(path)?.[1] ?? 'fr',
    entry,
    referrer: entry ? cleanHost(body.referrer) : '',
    device: deviceOf(ua),
    country: String(headers['x-vercel-ip-country'] || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2),
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
  try {
    const r = await fetch(`${url}/rest/v1/site_events`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(4000),
    });
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
