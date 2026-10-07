// Writing help for /admin through Google's Gemini API, free tier (used by /api/ai). Only the text
// being written is sent; for a reply to a quote request, the request's details without the
// client's name, phone or e-mail. Files starting with "_" are not routes.

export const TASKS = ['correct', 'improve', 'translate', 'propose', 'reply'];
export const LANGS = ['fr', 'en', 'ar'];
export const FIELDS = ['title', 'text', 'short', 'faq', 'reply'];
export const MAX_INPUT = 6000;

const LANG_NAME = {
  fr: 'French',
  en: 'English',
  ar: 'Arabic (Modern Standard Arabic, as used by Algerian businesses)',
};

const FIELD_NAME = {
  title: 'a title on the website (short, no final full stop)',
  text: 'a text of the website (a description, a presentation or a paragraph)',
  short: 'a short line of the website (a few words, such as a banner or a list of brands)',
  faq: 'a question or answer of the website’s FAQ',
  reply: 'a reply to a client',
};

const SYSTEM = [
  'You help MTE Industrial Electronics, a small industrial automation and electronics business in Médéa, Algeria',
  '(PLC and HMI programming, control panel troubleshooting, electrical studies, variable frequency drive and electronic board repair),',
  'write the texts of its public website (French, English and Arabic versions) and its replies to clients.',
  'Answer with the resulting text only: no introduction, no explanation, no quotation marks around it, no Markdown.',
  'Keep technical terms, brand names, model numbers, units, numbers, #hashtags, arrows (→) and line breaks as given.',
  'Never invent facts, prices, durations, dates, guarantees, client names or results that are not in the text.',
].join(' ');

/** The instructions for one request ({ task, text, lang, target, field, request }). */
export function buildPrompt(req) {
  const field = FIELD_NAME[req.field] ?? FIELD_NAME.text;
  const lang = LANG_NAME[req.lang] ?? LANG_NAME.fr;
  const text = String(req.text ?? '').trim();
  let task;
  switch (req.task) {
    case 'correct':
      task = `Correct the spelling, grammar and punctuation of this text, which is ${field}. Keep its language (${lang}), its meaning and its wording; change only what is wrong.`;
      break;
    case 'improve':
      task = `Rewrite this text, which is ${field}, so that it is clear, natural and professional for clients of industrial services. Write in ${lang}. Keep every fact.`;
      break;
    case 'translate':
      task = `Translate this text, which is ${field}, into ${LANG_NAME[req.target] ?? LANG_NAME.en}, for the matching version of the website. Use the usual professional terms of the field.`;
      break;
    case 'propose':
      task = `Write ${field} in ${lang}, based on these notes or keywords. Use only the information they contain.`;
      break;
    case 'reply': {
      const r = req.request ?? {};
      const details = [
        r.request_type && `Need: ${r.request_type}`,
        r.equipment && `Equipment: ${r.equipment}`,
        r.on_site ? 'The client would like an intervention on site.' : '',
        `Message: ${text}`,
      ].filter(Boolean);
      return {
        system: SYSTEM,
        user: [
          `Write MTE's reply, in ${lang}, to this quote request received from the website.`,
          'Begin with a greeting that uses the placeholder {NOM} for the client’s name, exactly written like that.',
          'Thank the client, show that the need is understood, ask the one to three questions most useful to prepare a diagnosis or a quote',
          '(for example photos of the panel or of the nameplate, the fault code shown, the PLC or drive model), and propose the next step',
          '(a call, a visit, or bringing the equipment to the workshop). Do not give prices or deadlines.',
          'Plain text for WhatsApp or e-mail, five to ten short lines, signed "MTE Industrial Electronics".',
          '',
          'Request:',
          ...details,
        ].join('\n'),
      };
    }
    default:
      task = `Improve this text, which is ${field}.`;
  }
  return { system: SYSTEM, user: `${task}\n\nText:\n${text}` };
}

/** Removes what models sometimes add around the answer (quotes, code fences). */
export function cleanAnswer(raw) {
  let s = String(raw ?? '').trim();
  s = s.replace(/^```[a-z]*\s*\n?/i, '').replace(/\n?```$/, '').trim();
  for (const [open, close] of [['"', '"'], ['«', '»'], ['“', '”'], ["'", "'"]]) {
    if (s.length > 1 && s.startsWith(open) && s.endsWith(close) && !s.slice(1, -1).includes(close)) s = s.slice(1, -1).trim();
  }
  return s;
}

/** Free-tier models, best first; GEMINI_MODEL (comma-separated) replaces the list. */
export const DEFAULT_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];

export function modelsFrom(env) {
  const list = String(env ?? '').split(',').map((m) => m.trim()).filter(Boolean);
  return list.length ? list : DEFAULT_MODELS;
}

/** The answer text of a generateContent response, without "thought" parts. */
export function answerText(json) {
  if (json?.promptFeedback?.blockReason) return { error: 'blocked' };
  const candidate = json?.candidates?.[0];
  if (!candidate) return { error: 'empty' };
  const text = (candidate.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('');
  if (!text.trim()) return { error: ['SAFETY', 'PROHIBITED_CONTENT'].includes(candidate.finishReason) ? 'blocked' : 'empty' };
  return { text: cleanAnswer(text) };
}

/**
 * Calls Gemini (generateContent), trying the next model when one is missing, overloaded or out
 * of free quota. An invalid key or a blocked text stops at once.
 * Resolves to { ok: true, text, model } or { ok: false, error }.
 */
export async function generate(req, { apiKey, models = DEFAULT_MODELS, fetchImpl = fetch, timeoutMs = 25000 } = {}) {
  if (!apiKey) return { ok: false, error: 'not_configured' };
  const { system, user } = buildPrompt(req);
  const precise = req.task === 'correct' || req.task === 'translate';
  let last = 'unavailable';
  for (const model of models) {
    let res;
    try {
      res = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          // Room for the model's own reasoning, which counts in the output on recent models.
          generationConfig: { temperature: precise ? 0.2 : 0.6, maxOutputTokens: 4096 },
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      last = 'unavailable';
      continue;
    }
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      const answer = answerText(json);
      if (answer.text) return { ok: true, text: answer.text, model };
      if (answer.error === 'blocked') return { ok: false, error: 'blocked' };
      last = answer.error;
      continue;
    }
    const message = `${json?.error?.status ?? ''} ${json?.error?.message ?? ''}`;
    if (res.status === 400 && /API[_ ]?key/i.test(message)) return { ok: false, error: 'invalid_key' };
    if (res.status === 401 || res.status === 403) return { ok: false, error: 'invalid_key' };
    last = res.status === 429 ? 'quota' : 'unavailable';
  }
  return { ok: false, error: last };
}
