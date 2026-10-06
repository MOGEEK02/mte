import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// index.html carries default tags for crawlers that don't run JavaScript;
// once the app runs, each page sets its own through <Seo>.
document.querySelectorAll("[data-seo]").forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
