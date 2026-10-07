// /api/rebuild — regenerates the pre-rendered pages (new projects, edited services, contact
// details) by starting a Vercel deployment through a Deploy Hook.
// Called by /admin ("Mettre à jour le site public", signed-in admin only) and once a day by the
// Vercel cron in vercel.json.
//
// Vercel environment variables:
//   DEPLOY_HOOK_URL  Settings → Git → Deploy Hooks → create one for branch "main"
//   CRON_SECRET      any long random string (Vercel sends it with the daily cron call)

import { bearer, isAdmin } from './_admin.js';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const fromCron = Boolean(process.env.CRON_SECRET) && auth === `Bearer ${process.env.CRON_SECRET}`;
  if (!fromCron) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'method' });
    }
    if (!(await isAdmin(bearer(req)))) return res.status(403).json({ error: 'forbidden' });
  }

  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) return res.status(503).json({ error: 'not_configured' });
  try {
    const r = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(8000) });
    if (!r.ok) {
      console.error('rebuild: deploy hook answered', r.status);
      return res.status(502).json({ error: 'hook_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('rebuild: deploy hook unreachable', err);
    return res.status(502).json({ error: 'hook_failed' });
  }
}
