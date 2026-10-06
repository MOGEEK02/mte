import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Pre-rendered pages carry their title, description, etc. for crawlers that don't run JavaScript;
// once the app runs, each page sets its own through <Seo>.
document.querySelectorAll("[data-seo]").forEach((el) => el.remove());

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pages built by scripts/prerender.mjs already contain the content: reuse it instead of redrawing.
if (root.hasChildNodes() && window.__MTE_DATA__) hydrateRoot(root, app);
else createRoot(root).render(app);
