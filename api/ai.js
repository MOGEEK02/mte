// POST /api/ai — writing help for /admin (signed-in admin only): correct, improve, translate,
// propose, or draft a reply to a quote request. See api/_gemini.js.
// Answers { text } or { error: not_configured | invalid_key | quota | blocked | unavailable | empty }.
//
// Vercel environment variables:
//   GEMINI_API_KEY  free key from https://aistudio.google.com/apikey
//   GEMINI_MODEL    optional, comma-separated list replacing the built-in free models

import { bearer, isAdmin } from './_admin.js';
import { FIELDS, generate, LANGS, MAX_INPUT, modelsFrom, TASKS } from './_gemini.js';

const clip = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method' });
  }
  if (!(await isAdmin(bearer(req)))) return res.status(403).json({ error: 'forbidden' });

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const request = {
    task: body.task,
    text: clip(body.text, MAX_INPUT).trim(),
    lang: body.lang,
    target: body.target,
    field: body.field,
    // Reply drafts: the request's details only (never the client's name or contacts).
    request:
      body.task === 'reply' && body.request && typeof body.request === 'object'
        ? { request_type: clip(body.request.request_type, 120), equipment: clip(body.request.equipment, 160), on_site: body.request.on_site === true }
        : undefined,
  };
  if (!TASKS.includes(request.task) || !LANGS.includes(request.lang) || !FIELDS.includes(request.field) || !request.text) {
    return res.status(400).json({ error: 'invalid' });
  }
  if (request.task === 'translate' && !LANGS.includes(request.target)) return res.status(400).json({ error: 'invalid' });

  const result = await generate(request, { apiKey: process.env.GEMINI_API_KEY, models: modelsFrom(process.env.GEMINI_MODEL) });
  if (!result.ok) return res.status(result.error === 'not_configured' ? 503 : 502).json({ error: result.error });
  return res.status(200).json({ text: result.text });
}
