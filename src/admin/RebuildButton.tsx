import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { supabase } from "./supabase";
import { useFlash } from "./ui";

/**
 * Regenerates the pages that Google and AI assistants read (built at each deployment).
 * Visitors always see the latest data; this updates what crawlers see. It also runs every night.
 */
export function RebuildButton({ className, label = "Mettre à jour le site public", onDone }: { className: string; label?: string; onDone?: () => void }) {
  const flash = useFlash();
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const { data } = await supabase.auth.getSession();
    const res = await fetch("/api/rebuild", { method: "POST", headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` } }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      onDone?.();
      return flash("Mise à jour lancée : le site public sera régénéré dans 1 à 2 minutes.");
    }
    const err = res ? ((await res.json().catch(() => ({}))) as { error?: string }).error : "";
    flash(
      err === "not_configured"
        ? "Ajoutez DEPLOY_HOOK_URL dans Vercel (projet du site → Settings → Environment Variables), puis redéployez."
        : "La mise à jour n’a pas pu être lancée.",
      "error",
    );
  };
  return (
    <button type="button" onClick={run} disabled={busy} title="Régénère les pages lues par Google et les assistants IA. Se fait aussi chaque nuit." className={className}>
      <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />
      {label}
    </button>
  );
}
