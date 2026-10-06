import { createClient } from "@supabase/supabase-js";

// Signed-in client for /admin only (the public pages use plain REST reads in src/db.ts).
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const key = ((import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined) ?? "";

export const configured = Boolean(url && key);

export const supabase = createClient(url || "https://invalid.supabase.co", key || "missing", {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "mte-admin-auth" },
});

/** Public bucket for project photos (created by supabase/admin.sql). */
export const BUCKET = "portfolio";

type DbError = { code?: string; message?: string } | null | undefined;

/** The tables or columns from supabase/admin.sql are not there yet. */
export function isMissingSetup(error: DbError) {
  return Boolean(error && ["42P01", "42703", "PGRST202", "PGRST204", "PGRST205"].includes(error.code ?? ""));
}

export function errorMessage(error: DbError): string {
  if (!error) return "";
  if (isMissingSetup(error)) return "La base de données n’est pas encore préparée : exécutez supabase/admin.sql dans Supabase.";
  if (error.code === "42501") return "Action refusée : ce compte n’a pas les droits d’administration.";
  if (error.code === "23505") return "Cette adresse existe déjà.";
  return error.message || "Erreur inattendue.";
}

/** Storage path of a file in our bucket, from its public URL (null for outside links). */
export function storagePath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  return i >= 0 ? decodeURIComponent(publicUrl.slice(i + marker.length)) : null;
}
