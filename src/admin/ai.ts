import { supabase } from "./supabase";

/** Writing help through /api/ai (Gemini, free tier). See api/_gemini.js. */
export type AiTask = "correct" | "improve" | "translate" | "propose" | "reply";
export type AiLang = "fr" | "en" | "ar";
export type AiField = "title" | "text" | "short" | "faq" | "reply";

export type AiRequest = {
  task: AiTask;
  text: string;
  lang: AiLang;
  target?: AiLang;
  field: AiField;
  /** Reply drafts only: the request's details, never the client's name or contacts. */
  request?: { request_type: string; equipment: string; on_site: boolean };
};

const ERRORS: Record<string, string> = {
  not_configured: "L’assistant IA n’est pas encore activé : ajoutez la clé GEMINI_API_KEY dans Vercel (projet du site), puis redéployez.",
  invalid_key: "La clé Gemini est refusée : vérifiez GEMINI_API_KEY dans Vercel.",
  quota: "Limite gratuite de Gemini atteinte pour le moment. Réessayez dans une minute.",
  blocked: "Gemini a refusé ce texte (filtre de sécurité). Reformulez-le.",
  forbidden: "Session expirée : reconnectez-vous.",
  empty: "Gemini n’a rien proposé. Réessayez ou reformulez.",
  unavailable: "L’assistant ne répond pas pour le moment. Réessayez.",
};

export const aiErrorText = (code: string) => ERRORS[code] ?? ERRORS.unavailable;

export async function askAi(body: AiRequest): Promise<{ text: string } | { error: string }> {
  const { data } = await supabase.auth.getSession();
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
    if (res.ok && json.text) return { text: json.text };
    return { error: json.error ?? "unavailable" };
  } catch {
    return { error: "unavailable" };
  }
}
