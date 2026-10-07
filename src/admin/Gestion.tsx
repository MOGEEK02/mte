import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, Receipt, RefreshCw } from "lucide-react";

/** "/admin/gestion/documents/12?x" → "/gestion/documents/12?x" */
const framePath = (pathname: string, search: string) => `/gestion${pathname.replace(/^\/admin\/gestion/, "")}${search}`;

/**
 * The invoicing app (MTE Facturation, served on this site under /gestion) inside the admin:
 * /admin/gestion/<page> shows /gestion/<page>. Pages opened inside are mirrored in the address,
 * so a reload or a bookmark comes back to them. It keeps its own login.
 */
export default function Gestion() {
  const { pathname, search, state } = useLocation();
  const navigate = useNavigate();
  const frame = useRef<HTMLIFrameElement>(null);
  const target = framePath(pathname, search);
  // What the frame shows (or is loading), so the admin address and the frame never chase each other.
  const shown = useRef(target);
  const initial = useRef(target);
  const fromFrame = (state as { fromFrame?: boolean } | null)?.fromFrame === true;

  // A link of the admin (menu, search) asked for another page: open it in the frame.
  useEffect(() => {
    if (target === shown.current) return;
    shown.current = target;
    if (fromFrame) return;
    try {
      frame.current?.contentWindow?.location.assign(target);
    } catch {
      if (frame.current) frame.current.src = target;
    }
  }, [target, fromFrame]);

  // A page opened inside the frame: show its address in the admin.
  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const loc = frame.current?.contentWindow?.location;
        if (!loc || !loc.pathname.startsWith("/gestion")) return;
        const inFrame = loc.pathname + loc.search;
        if (inFrame === shown.current) return;
        shown.current = inFrame;
        navigate(`/admin/gestion${loc.pathname.slice("/gestion".length)}${loc.search}`, { replace: true, state: { fromFrame: true } });
      } catch {
        // Not readable (should not happen: same site).
      }
    }, 600);
    return () => window.clearInterval(id);
  }, [navigate]);

  return (
    <div className="flex h-[calc(100dvh-7.25rem)] flex-col lg:h-dvh">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <Receipt className="size-4 text-brand-600" /> Facturation
          <span className="hidden text-xs font-normal text-slate-500 sm:inline">devis, factures, clients, catalogue</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => frame.current?.contentWindow?.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-navy-900"
          >
            <RefreshCw className="size-3.5" /> Recharger
          </button>
          <a
            href={target}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-navy-900"
          >
            <ExternalLink className="size-3.5" /> Plein écran
          </a>
        </div>
      </div>
      <iframe ref={frame} src={initial.current} title="Facturation MTE" className="w-full flex-1 border-0 bg-white" />
    </div>
  );
}
