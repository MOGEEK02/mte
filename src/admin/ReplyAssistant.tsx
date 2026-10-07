import { useEffect, useState } from "react";
import { Copy, Loader2, Mail, RefreshCw, Sparkles, X } from "lucide-react";
import { BrandIcon } from "../ui/BrandIcon";
import { aiErrorText, askAi } from "./ai";
import { Button, useFlash } from "./ui";

type Request = { name: string; phone: string; email: string; request_type: string; equipment: string; message: string; on_site: boolean };

/** wa.me link for an Algerian number typed as 0550…, +213 550… or 213550…; null when too short. */
function whatsappTo(phone: string, text: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `213${digits.slice(1)}`;
  if (digits.length < 9) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Drafts a reply to a quote request with Gemini (French or Arabic), to copy or send by WhatsApp or
 * e-mail. Only the request's need, equipment and message are sent: the client's name is added
 * here, in place of {NOM}.
 */
export function ReplyAssistant({ request }: { request: Request }) {
  const flash = useFlash();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"fr" | "ar">(/\p{Script=Arabic}/u.test(request.message) ? "ar" : "fr");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const firstName = request.name.trim().split(/\s+/)[0] ?? "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const generate = async (l = lang) => {
    setStatus("loading");
    const result = await askAi({
      task: "reply",
      text: request.message,
      lang: l,
      field: "reply",
      request: { request_type: request.request_type, equipment: request.equipment, on_site: request.on_site },
    });
    if ("text" in result) {
      setText(result.text.replace(/\{\s*NOM\s*\}/gi, firstName));
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("error");
    }
  };

  const start = () => {
    setOpen(true);
    if (status !== "done") generate();
  };
  const switchLang = (l: "fr" | "ar") => {
    setLang(l);
    generate(l);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash("Réponse copiée");
    } catch {
      flash("Copie impossible : sélectionnez le texte et copiez-le.", "error");
    }
  };
  const wa = request.phone ? whatsappTo(request.phone, text) : null;
  const subject = lang === "ar" ? "طلب عرض السعر – MTE" : "Votre demande de devis – MTE";

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
      >
        <Sparkles className="size-4" /> Proposer une réponse
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="reply-title" className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="reply-title" className="flex items-center gap-2 font-semibold text-navy-900">
                  <Sparkles className="size-4 text-violet-600" /> Réponse à {firstName || "ce client"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">Brouillon de Gemini (gratuit) : relisez-le. Le nom, le téléphone et l’e-mail du client ne lui sont pas envoyés.</p>
              </div>
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="size-4" />
              </button>
            </div>

            <div role="tablist" aria-label="Langue de la réponse" className="mt-4 inline-flex rounded-lg bg-slate-100 p-1">
              {(["fr", "ar"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  disabled={status === "loading"}
                  onClick={() => l !== lang && switchLang(l)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${lang === l ? "bg-white text-navy-900 shadow-xs" : "text-slate-600 hover:text-navy-900"}`}
                >
                  {l === "fr" ? "Français" : "العربية"}
                </button>
              ))}
            </div>

            {status === "loading" && (
              <p className="flex items-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" /> Rédaction de la réponse…
              </p>
            )}
            {status === "error" && <p className="mt-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-700">{aiErrorText(error)}</p>}
            {status === "done" && (
              <textarea
                aria-label="Réponse proposée"
                rows={Math.min(16, Math.max(6, text.split("\n").length + 1))}
                dir={lang === "ar" ? "rtl" : "ltr"}
                lang={lang}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-4 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm leading-relaxed text-ink focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15 focus:outline-none"
              />
            )}

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <Button onClick={() => generate()} disabled={status === "loading"}>
                <RefreshCw className="size-4" /> Autre proposition
              </Button>
              {status === "done" && (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={copy}>
                    <Copy className="size-4" /> Copier
                  </Button>
                  {request.email && (
                    <a
                      href={`mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      <Mail className="size-4" /> E-mail
                    </a>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25d366] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1ebe5b]">
                      <BrandIcon name="WhatsApp" className="size-4" /> WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
