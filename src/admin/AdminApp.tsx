import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings as SettingsIcon,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { Seo } from "../ui/Seo";
import { excludeThisDevice } from "../track";
import { configured, errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Field, FlashProvider, inputClass, Loading, Notice } from "./ui";
import { RebuildButton } from "./RebuildButton";
import Dashboard from "./Dashboard";
import Requests, { REQUESTS_CHANGED } from "./Requests";
import ContentAdmin from "./ContentAdmin";
import ReviewsAdmin from "./ReviewsAdmin";
import StoreAdmin from "./StoreAdmin";
import ProductEditor from "./ProductEditor";
import Projects from "./Projects";
import ProjectEditor from "./ProjectEditor";
import ServicesAdmin from "./ServicesAdmin";
import ServiceEditor from "./ServiceEditor";
import Settings from "./Settings";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <img src="/images/logo.png" alt="MTE" width={900} height={384} className="h-10 w-auto" />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : error.message);
  };

  const forgot = async () => {
    if (!email.trim()) return setError("Saisissez d’abord votre e-mail.");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    if (error) setError(error.message);
    else setInfo("Si ce compte existe, un e-mail de réinitialisation vient d’être envoyé.");
  };

  return (
    <Shell>
      <h1 className="text-lg font-semibold text-navy-900">Administration du site</h1>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="E-mail" htmlFor="a-email">
          <input id="a-email" type="email" autoComplete="username" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Mot de passe" htmlFor="a-password">
          <input id="a-password" type="password" autoComplete="current-password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <Notice tone="error">{error}</Notice>}
        {info && <p className="text-sm text-emerald-700">{info}</p>}
        <Button type="submit" variant="dark" loading={busy} className="w-full">
          Se connecter
        </Button>
        <button type="button" onClick={forgot} className="w-full text-center text-sm text-slate-500 hover:text-navy-900">
          Mot de passe oublié ?
        </button>
      </form>
    </Shell>
  );
}

function SetPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 10) return setError("Au moins 10 caractères.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else onDone();
  };
  return (
    <Shell>
      <h1 className="text-lg font-semibold text-navy-900">Nouveau mot de passe</h1>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="Mot de passe" htmlFor="a-new" hint="Au moins 10 caractères.">
          <input id="a-new" type="password" autoComplete="new-password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <Notice tone="error">{error}</Notice>}
        <Button type="submit" variant="dark" loading={busy} className="w-full">
          Enregistrer
        </Button>
      </form>
    </Shell>
  );
}

const NAV = [
  { to: "/admin", end: true, label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/demandes", end: false, label: "Demandes", icon: Inbox, badge: true },
  { to: "/admin/realisations", end: false, label: "Réalisations", icon: FolderKanban },
  { to: "/admin/services", end: false, label: "Services", icon: Wrench },
  { to: "/admin/contenu", end: false, label: "Textes du site", icon: FileText },
  { to: "/admin/avis", end: false, label: "Avis clients", icon: MessageSquareQuote },
  { to: "/admin/boutique", end: false, label: "Boutique", icon: ShoppingBag },
  { to: "/admin/parametres", end: false, label: "Paramètres", icon: SettingsIcon },
];

/** Number of requests still marked "Nouveau", for the menu. */
function useNewRequests() {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () =>
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "nouveau")
        .then(({ count }) => setCount(count ?? 0));
    load();
    window.addEventListener(REQUESTS_CHANGED, load);
    return () => window.removeEventListener(REQUESTS_CHANGED, load);
  }, [pathname]);
  return count;
}

function Layout({ email }: { email: string }) {
  const newRequests = useNewRequests();
  // The owner's own visits are left out of the statistics on this device.
  useEffect(excludeThisDevice, []);
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="bg-navy-950 lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:px-5 lg:py-6">
          <Link to="/admin" className="block">
            <img src="/images/logo%20white.png" alt="MTE" width={900} height={384} className="h-8 w-auto" />
          </Link>
          <p className="hidden text-xs text-slate-500 lg:mt-2 lg:block">Administration du site</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:px-3 lg:pb-0">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link}>
              <n.icon className="size-4 shrink-0" />
              <span className="whitespace-nowrap">{n.label}</span>
              {n.badge && newRequests > 0 && (
                <span className="ms-auto rounded-full bg-brand px-1.5 text-[11px] leading-5 font-bold text-navy-950" aria-label={`${newRequests} nouvelle(s)`}>
                  {newRequests}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <RebuildButton className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-brand hover:bg-white/5 disabled:opacity-60" />
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            <ExternalLink className="size-4" />
            Voir le site
          </a>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
          <p className="truncate px-3 pt-2 text-xs text-slate-500">{email}</p>
        </div>
      </aside>
      <main className="flex-1 lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="demandes" element={<Requests />} />
            <Route path="realisations" element={<Projects />} />
            <Route path="realisations/:id" element={<ProjectEditor />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="services/:slug" element={<ServiceEditor />} />
            <Route path="contenu" element={<ContentAdmin />} />
            <Route path="avis" element={<ReviewsAdmin />} />
            <Route path="boutique" element={<StoreAdmin />} />
            <Route path="boutique/:id" element={<ProductEditor />} />
            <Route path="parametres" element={<Settings />} />
          </Routes>
          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-sm lg:hidden">
            <RebuildButton className="inline-flex items-center gap-1.5 font-medium text-navy-900 disabled:opacity-60" />
            <a href="/" target="_blank" rel="noopener" className="text-slate-500">Voir le site</a>
            <button type="button" onClick={() => supabase.auth.signOut()} className="text-slate-500">Déconnexion</button>
          </div>
        </div>
      </main>
    </div>
  );
}

type Access = "checking" | "admin" | "denied" | "setup" | { error: string };

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [recovering, setRecovering] = useState(false);
  // Admin check result, tied to the account it was made for.
  const [checked, setChecked] = useState<{ userId: string; access: Access } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    supabase.rpc("is_site_admin").then(({ data, error }) => {
      if (!alive) return;
      const access: Access = error ? (isMissingSetup(error) ? "setup" : { error: errorMessage(error) }) : data ? "admin" : "denied";
      setChecked({ userId, access });
    });
    return () => {
      alive = false;
    };
  }, [userId]);

  const access: Access = checked && checked.userId === userId ? checked.access : "checking";
  const page = (() => {
    if (!configured) return <Shell><Notice tone="error">Variables Supabase manquantes (VITE_SUPABASE_URL).</Notice></Shell>;
    if (session === undefined) return <Shell><Loading /></Shell>;
    if (recovering && session) return <SetPassword onDone={() => setRecovering(false)} />;
    if (!session) return <Login />;
    if (access === "checking") return <Shell><Loading /></Shell>;
    if (access === "admin") return <Layout email={session.user.email ?? ""} />;
    return (
      <Shell>
        <Notice tone="error">
          {access === "setup"
            ? "La base de données n’est pas encore préparée : exécutez supabase/admin.sql dans Supabase → SQL Editor."
            : access === "denied"
              ? "Ce compte n’a pas accès à l’administration."
              : access.error}
        </Notice>
        <Button className="mt-4 w-full" onClick={() => supabase.auth.signOut()}>
          Se déconnecter
        </Button>
      </Shell>
    );
  })();

  return (
    <FlashProvider>
      <Seo lang="fr" path="/admin" title="Administration | MTE" description="Administration du site MTE." noindex />
      {page}
    </FlashProvider>
  );
}
