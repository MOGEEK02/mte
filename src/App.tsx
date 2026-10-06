import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "./ui/Layout";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import PortfolioPost from "./pages/PortfolioPost";
import NotFound from "./pages/NotFound";

// Loaded only when /admin is opened, so visitors never download it.
const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioPost />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
