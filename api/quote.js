// POST /api/quote — a quote request from the site's form. It is saved in the "quote_requests"
// table (listed in /admin) and e-mailed to MTE through Resend. The client gets a success
// answer as soon as one of the two worked.
//
// Vercel environment variables:
//   SUPABASE_SECRET_KEY  secret key of the website's Supabase project (saves the request)
//   RESEND_API_KEY       API key from resend.com (sends the e-mail)
//   QUOTE_TO_EMAIL       where requests arrive (default: moutiefekhar@gmail.com)
//   QUOTE_FROM_EMAIL     sender; until a domain is verified in Resend, keep the default
//                        "onboarding@resend.dev", which can only send to the Resend account's own e-mail.

const TO = process.env.QUOTE_TO_EMAIL || 'moutiefekhar@gmail.com';
const FROM = process.env.QUOTE_FROM_EMAIL || 'MTE – Site web <onboarding@resend.dev>';

const LIMITS = { name: 120, company: 160, phone: 40, email: 160, equipment: 80, model: 160, service: 120, message: 4000 };

function clean(value, max) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim().slice(0, max) : '';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function sendEmail(f, onSite, emailValid) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('quote: RESEND_API_KEY is not set');
    return false;
  }
  const rows = [
    ['Service', f.service],
    ['Nom', f.name],
    ['Entreprise', f.company],
    ['Téléphone', f.phone],
    ['E-mail', f.email],
    ['Besoin', f.equipment],
    ['Matériel', f.model],
    ['Sur site', onSite ? 'Oui, intervention sur site souhaitée' : ''],
  ].filter(([, v]) => v);

  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\n${f.message}\n\nToutes les demandes : https://moutie.vercel.app/admin`;
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
  <p style="margin-top:16px;color:#94a3b8;font-size:12px">Envoyé depuis le formulaire de moutie.vercel.app${emailValid ? ' — répondez directement à cet e-mail pour écrire au client.' : '.'}
    <a href="https://moutie.vercel.app/admin" style="color:#0a2a4a">Ouvrir les demandes</a></p>
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
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error('quote: Resend error', r.status, await r.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('quote: Resend unreachable', err);
    return false;
  }
}

async function saveRequest(f, onSite, emailSent) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error('quote: SUPABASE_SECRET_KEY or VITE_SUPABASE_URL is not set');
    return false;
  }
  try {
    const r = await fetch(`${url}/rest/v1/quote_requests`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        name: f.name,
        company: f.company,
        phone: f.phone,
        email: f.email,
        request_type: f.equipment,
        equipment: f.model,
        service: f.service,
        message: f.message,
        on_site: onSite,
        email_sent: emailSent,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error('quote: save failed', r.status, await r.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('quote: database unreachable', err);
    return false;
  }
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

  const emailSent = await sendEmail(f, onSite, emailValid);
  const saved = await saveRequest(f, onSite, emailSent);
  if (!emailSent && !saved) return res.status(502).json({ error: 'send_failed' });
  return res.status(200).json({ ok: true });
}
