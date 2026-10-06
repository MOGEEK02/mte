// POST /api/quote — e-mails a quote request from the site's form to MTE through Resend.
//
// Vercel environment variables:
//   RESEND_API_KEY    API key from resend.com (required)
//   QUOTE_TO_EMAIL    where requests arrive (default: moutiefekhar@gmail.com)
//   QUOTE_FROM_EMAIL  sender; until a domain is verified in Resend, keep the default
//                     "onboarding@resend.dev", which can only send to the Resend account's own e-mail.

const TO = process.env.QUOTE_TO_EMAIL || 'moutiefekhar@gmail.com';
const FROM = process.env.QUOTE_FROM_EMAIL || 'MTE – Site web <onboarding@resend.dev>';

const LIMITS = { name: 120, company: 160, phone: 40, email: 160, equipment: 80, model: 160, service: 120, message: 4000 };

function clean(value, max) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim().slice(0, max) : '';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method' });
  }
  const body = typeof req.body === 'object' && req.body ? req.body : {};

  // Bots: the hidden "website" field is filled, or the form was sent within seconds of being touched.
  // Answer as if it worked so they don't retry.
  if (clean(body.website, 200) || (typeof body.elapsed === 'number' && body.elapsed < 2500)) {
    return res.status(200).json({ ok: true });
  }

  const f = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]));
  const onSite = body.onSite === true;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  if (!f.name || !f.message || (!f.phone && !emailValid)) {
    return res.status(400).json({ error: 'invalid' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('quote: RESEND_API_KEY is not set');
    return res.status(503).json({ error: 'not_configured' });
  }

  const rows = [
    ['Service', f.service],
    ['Nom', f.name],
    ['Entreprise', f.company],
    ['Téléphone', f.phone],
    ['E-mail', f.email],
    ['Équipement', f.equipment],
    ['Marque / modèle', f.model],
    ['Sur site', onSite ? 'Oui, intervention sur site souhaitée' : ''],
  ].filter(([, v]) => v);

  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\n${f.message}`;
  const phoneLink = f.phone ? `tel:${f.phone.replace(/[^\d+]/g, '')}` : '';
  const html = `
<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f1b2a;max-width:600px">
  <h2 style="margin:0 0 12px;color:#0a2a4a">Nouvelle demande de devis</h2>
  <table style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0">${
            k === 'Téléphone' && phoneLink ? `<a href="${escapeHtml(phoneLink)}">${escapeHtml(v)}</a>` : escapeHtml(v)
          }</td></tr>`,
      )
      .join('')}
  </table>
  <div style="margin-top:16px;padding:12px 14px;background:#f1f5f9;border-radius:6px;white-space:pre-wrap">${escapeHtml(f.message)}</div>
  <p style="margin-top:16px;color:#94a3b8;font-size:12px">Envoyé depuis le formulaire de moutie.vercel.app${emailValid ? ' — répondez directement à cet e-mail pour écrire au client.' : '.'}</p>
</div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: `Demande de devis – ${f.equipment || f.service || 'site web'} – ${f.name}`,
        text,
        html,
        ...(emailValid ? { reply_to: f.email } : {}),
      }),
    });
    if (!r.ok) {
      console.error('quote: Resend error', r.status, await r.text());
      return res.status(502).json({ error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('quote: Resend unreachable', err);
    return res.status(502).json({ error: 'send_failed' });
  }
}
