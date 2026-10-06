// Read-only access to the site's public Supabase tables through the REST API.
// The site only reads a few rows, so this replaces the full supabase-js client.

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

/** GET /rest/v1/<table>?<query>. Resolves to [] when unconfigured or on any error. */
export async function select<T>(table: string, query: Record<string, string>): Promise<T[]> {
  if (!URL_BASE || !KEY) return [];
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${table}?${new URLSearchParams(query)}`, {
      headers: { apikey: KEY, Accept: "application/json" },
    });
    return res.ok ? ((await res.json()) as T[]) : [];
  } catch {
    return [];
  }
}
