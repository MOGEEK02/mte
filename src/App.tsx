import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { DEFAULT_LOCALE } from "./i18n";
import HomePage from "./components/HomePage";
import Portfolio from "./components/Portfolio";
import SinglePortfolioPost from "./components/SinglePortfolioPost";

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<SinglePortfolioPost />} />
        <Route path="/:lang" element={<HomePage />} />
        <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </LanguageProvider>
  );
}
