// GET /api/status — for /admin → Tableau de bord (signed-in admin only): which Vercel settings are
// in place. Only yes/no answers; no value is ever sent back.

import { bearer, isAdmin } from './_admin.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!(await isAdmin(bearer(req)))) return res.status(403).json({ error: 'forbidden' });
  const set = (name) => Boolean((process.env[name] || '').trim());
  return res.status(200).json({
    deployHook: set('DEPLOY_HOOK_URL'),
    cronSecret: set('CRON_SECRET'),
    resend: set('RESEND_API_KEY'),
    secretKey: set('SUPABASE_SECRET_KEY'),
    gemini: set('GEMINI_API_KEY'),
    environment: process.env.VERCEL_ENV || 'local',
  });
}
