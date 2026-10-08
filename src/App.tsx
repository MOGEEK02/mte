import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "./ui/Layout";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import PortfolioPost from "./pages/PortfolioPost";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import LocalPage from "./pages/LocalPage";
import { localPages } from "./local-seo";

// "/programmation-automate-blida", "/automatisme-alger"…: one page per service and city.
const LOCAL = localPages();

// Loaded only when /admin is opened, so visitors never download it.
const AdminApp = lazy(() => import("./admin/AdminApp"));

/** French at "/", English under "/en", Arabic under "/ar". Shared by the browser and the pre-renderer (src/entry-server.tsx). */
export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
            <AdminApp />
          </Suspense>
        }
      />
      {(["en", "ar"] as const).map((lang) => (
        <Route key={lang} path={`/${lang}`} element={<Layout lang={lang} />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:id" element={<PortfolioPost />} />
          <Route path="store" element={<Store />} />
          {LOCAL.map((p) => (
            <Route key={p.path} path={p.path.slice(1)} element={<LocalPage page={p} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      ))}
      <Route element={<Layout lang="fr" />}>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<PortfolioPost />} />
        <Route path="/store" element={<Store />} />
        {LOCAL.map((p) => (
          <Route key={p.path} path={p.path} element={<LocalPage page={p} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
