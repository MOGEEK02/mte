// Shared by the admin-only functions (/api/rebuild, /api/status). Files starting with "_" are
// not routes.

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/** Asks Supabase whether the signed-in user behind this token is the site admin. */
export async function isAdmin(token) {
  if (!token || !supabaseUrl || !supabaseKey) return false;
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/rpc/is_site_admin`, {
      method: 'POST',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(5000),
    });
    return r.ok && (await r.json()) === true;
  } catch {
    return false;
  }
}

/** The bearer token of a request ("Authorization: Bearer …"). */
export const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
